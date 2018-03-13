const net = require('net');
const EventEmmiter = require('events');
var interceptor;
var server;



const obj = 
{
	_emmiter : new EventEmmiter(),
	openLog : function(port){

		return new Promise((resolve,reject)=>{
			if(server || interceptor){
				reject(new Error("log_already_open"));
				return;
			}

			//initialize connections array
			var connections = Array(5).fill(0);
			server = net.createServer((socket)=>{
				obj._emmiter.emit("socket_opened",socket);
				
				//on connection look for open spot in connections array
				var foundSpot = false;
				for(var i = 0; i < connections.length; i++){
					if(!connections[i]){
						foundSpot = true;
						connections[i] = socket;
						socket.log_id = i;
						break;
					}
				}
				if(!foundSpot){
					connections.push(socket);
					socket.log_id = connections.length-1;
				}

				socket.on("data",function(data){
					obj._emmiter.emit("socket_data",socket,data);
				});
				//free spot on dead socket
				socket.on("end",()=>{
					obj._emmiter.emit("socket_closed",socket);
					connections[socket.log_id] = 0;
				});

				socket.on("error",(err)=>{
					obj._emmiter.emit("socket_error",socket,err);
				});
			});

			server.on("error",(err)=>{
				obj._emmiter.emit("server_error",err);
			});
		 
			//setup hook
			const hook = require('hook-std');
			interceptor = hook.hookStd({silent : false},(text)=>{
				for(var i = 0 ; i < connections.length; i++){
					if(connections[i])
						connections[i].write(text);
				}
			});

			server.listen(port,function(){
				resolve();
			});
		});
		
			
	},
	closeLog : function(){
		
		return new Promise((resolve,reject)=>{
			if(!server || !interceptor){
				reject(new Error("log_already_closed"));
				return;
			}
			interceptor();
			server.close((err)=>{
				if(err){
					reject(err);
					return;
				}
		 		server = null;
				interceptor = null;
				resolve();
				return;
			});
		});		

	},
	on : function(event,callback){
		obj._emmiter.on(event,callback);
	}
};
module.exports = obj;


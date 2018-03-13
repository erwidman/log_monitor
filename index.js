#!/usr/bin/env node
/*
	AUTHOR : 
		ERIC WIDMANN
	DATE : 	 
		3.11.2018
	DESCRIPTION: 
		An API and CLI to allow remote node server stdout monitoring, includes text coloring capabilities to differentiate log.

*/


const program  = require("commander");
const chalk = require("chalk");
const url = require("url");
const net = require("net");
const fs = require("fs");


//setup CLI
program
.version("0.0.1","-v, --version")
.command("connect <host> <port>")
.description("Connect to some IP utilizing the module function openLog")
.option("-c, --color <file>","Links a color file to log display.")
.action((host,port,options)=>{

	console.log("\nATTEMPTING CONNECTION TO "+host+" ON PORT "+port);

	//if the color option has been flaged, attempt to read input file
	var colorPal;
	if(options.color){

		var path;
		//absolute path
		if(options.color[0] == '/')
			path = options.color;
		//relative path
		else
			path = __dirname + "/" + options.color;
		
		//attempt read
		fs.readFile(path,(err,data)=>{
			//if failed to read file, exit
			if(err){
				console.log(chalk.red("FAILED TO READ COLOR FILE\n"));
				process.exit();
			}
			else{
				try{	
					colorPal = JSON.parse(data);
				}catch(ex){
					console.log(chalk.red("FAILED TO PARSE COLOR FILE\n"));
					process.exit();
				}			
			}
		});
	}

	//attempt connection to server
	var client = net.createConnection(port,host,()=>{
		console.log(chalk.green("SUCCESS\n"));
		connected = true;
	})

	//on error, close socket and exit
	client.on("error",(err)=>{
		console.log(chalk.red("FAILURE\n"));
		client.end();
		process.exit();
	});


	client.on("data",(data)=>{
		
		//process byte data
		data = data.toString("utf8");
		data = data.slice(0,data.length-1);
		

		//if the the color option was successful
		if(colorPal){

			for(var key in colorPal){
				//if there is a match with one of the coloring options
				if(new RegExp(key).test(data)){

					var matchOptions = colorPal[key];
					var chalkFunction = chalk;
					
					//set color options
					if(matchOptions.fg)
						chalkFunction = chalkFunction.hex(matchOptions.fg)
					if(matchOptions.bg)
						chalkFunction = chalkFunction.bgHex(matchOptions.bg)
					if(matchOptions.style){
						switch(matchOptions.style){
							case "bold" : chalkFunction = chalkFunction.bold;
								break;
							case "dim" : chalkFunction = chalkFunction.dim;
								break;
							case "underline" :
								chalkFunction = chalkFunction.underline
								break;
							default :
								break;
						}
					}
					console.log(chalkFunction(data));
					return;
					
				}
			}
		}

		console.log(data);


	});

	//exit process if socket is closed
	client.on("end",()=>{
		console.log(chalk.magenta("SOCKET CLOSED\n"));
		process.exit();
	});


	//timeout function for connection, 10s
	var connected = false;
	var connectionTimeout = setTimeout(()=>{
		if(!connected){
			console.log(chalk.red("CONNECTION TIMEOUT\n"));
			process.exit(1);
		}
		
	},10000);

});

//test if invoked from the command line
var regex = /log_monitor$/;
var runFromCLI = process.argv.reduce((acc,val)=>{
	if(regex.test(val))
		acc = true;
	return acc;
},false);

if(runFromCLI){
	program.parse(process.argv);
}



module.exports = require("./openLog.js");











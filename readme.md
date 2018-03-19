

> An API and CLI for remote node server monitoring, includes text coloring capabilities.

**Monitor stdout and stderr while highlighting important information remotely.**


## Installation
```

	npm install -g log_monitor			

```

##Usage

###Opening and closing a port for remote monitoring 

```javascript

	const logServer = require("log_monitor");
	
	logServer.openLog(8000)
	.then(()=>{
		//handle open
	})	
	.catch((err)=>{
		//handle error
	});

	logServer.closeLog()			
	.then(()=>{
		//handle close
	})
	.catch((err)=>{
		//handle error
	});

```

###Connecting to an open port from command line

```

	log_monitor connect 8.8.8.8 8000

```

###Linking a color specification:

> color.json
```

	{
		"ERROR:[0-9]" : {
			"fg" :"#343434",
			"bg" : "#FF4444",									
			"style" : "bold"
		},
		"CREDIT CARD READER" : {
			"fg" : "#808000",
			"style" : "underline"
		}
	}

```

> invocation
```

	log_monitor connect 8.8.8.8 8000 --color color.json			

```

![Imgur](https://i.imgur.com/quo77oO.gif)

##Events

**socket_open**<br/> 

&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;socket : A net.Socket Object of connected TCP Socket [socket docs](https://nodejs.org/api/net.html#net_class_net_socket)

**socket_closed**<br/>
 &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;socket : A net.Socket Object of connected TCP Socket [socket docs](https://nodejs.org/api/net.html#net_class_net_socket)

**socket_data**<br/>
  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;socket : A net.Socket Object of connected TCP Socket [socket docs](https://nodejs.org/api/net.html#net_class_net_socket)</br>
   &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;data: A byte buffer containing data sent by above socket

**socket_error**<br/> 
  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;socket : A net.Socket Object of connected TCP Socket [socket docs](https://nodejs.org/api/net.html#net_class_net_socket)</br>
   &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;err: Some error

**server_error**.<br/>
    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;err : Some error

```javascript

	const logServer = require("log_monitor");	

	logServer.on("socket_opened",(socket)=>{
		//handle connection
	});

	logServer.on("socket_closed",(socket)=>{
		//handle disconnect
	});

	logServer.on("socket_data",(socket,data)=>{
		//handle socket data
	});

	logServer.on("socket_error",(socket,err)=>{
		//handle error
	});

	logServer.on("server_error",(err)=>{
		//handle server error
	});


```

##DOCS

**require("log_monitor").openLog(port)**<br/>
&nbsp; &nbsp;Description:<br/>
   &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;Opens a TCP server on the input port for API.<br/>
&nbsp; &nbsp;Arguments:<br/>
    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;port : Desired port number for log server.<br/>
&nbsp; &nbsp;Return:<br/>
   &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;A promise that resolves when the TCP server is successfully instantiated.


**require("log_monitor").closeLog()**<br/>
&nbsp; &nbsp;Description:<br/>
    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;Closes TCP server opened by call to openLog - fails if server has not been open.<br/>
&nbsp; &nbsp;Arguments:<br/>
&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;N/A<br/>
&nbsp; &nbsp;Return:<br/>
&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;A promise that resolves when the TCP server is successfully closed.



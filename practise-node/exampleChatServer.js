var socketIO = require('socket.io');
var static 	= require('node-static');
var http		= require('http');
var util 		= require('util');

var clientFiles = new static.Server('./clients');

var httpServer = http.createServer(function(request, response) {
	request.addListener('end', function () {
		clientFiles.serve(request, response);
	    });
    });
httpServer.listen(2000);

var io = socketIO.listen(httpServer);


   io.sockets.on('connection', function(client) {
	console.log('just about to');
    client.emit('custom','Please enter a user name ...');

	client.on('myWish', function(wish) {
		console.log('my wish'+ wish);	
		client.emit('myWish', wish);	
		});
		
		
    var userName;
    client.on('custom', function(message) {
    	console.log('in mesage method here');
		var obj = JSON.parse(message);
		console.log(obj);
		console.log('done here .....');
		console.log(obj.action);
		console.log('after done again');
		    	
    	message = "deeef";
    	if(!userName) {
    		userName = message;
    		client.broadcast.emit('custom', userName + ' has entered the zone.');
    		return;
    		}
        var broadcastMessage = userName + ': ' + message;
        client.emit('custom', broadcastMessage);
        client.broadcast.emit('custom',broadcastMessage);
    });

    client.on('disconnect', function() {
        var broadcastMessage = userName + ' has left the zone.';
        client.broadcast.emit(broadcastMessage);
    });
});



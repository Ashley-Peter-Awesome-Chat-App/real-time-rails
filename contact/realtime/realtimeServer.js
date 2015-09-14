var io = require('socket.io').listen(5001),
	redis = require('redis').createClient();

redis.subscribe('rt-change');

io.on('connection', function(socket){
	console.log("someone connected");
	redis.on('message', function(channel, message){
		socket.emit('rt-change', JSON.parse(message));
	});
});
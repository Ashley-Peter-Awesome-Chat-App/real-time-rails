window.app.realtime = {
	connect : function() {
		window.app.socket = io.connect("http://0.0.0.0:5001");

		window.app.socket.on("rt-change", function(message){
			window.app.trigger(message.resource, message);
		});
	}
}

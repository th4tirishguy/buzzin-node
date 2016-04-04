var socket = io();

$(document).ready(function() {
	var displayName = $('#displayName').text();
	console.log(displayName);
	//socket.emit('user joined', displayName);
	var roomId = $('#roomId').text();
	socket.emit('create', roomId, displayName);

	$('#answer').click(function() {
		socket.emit('answer', displayName);
	})
});

socket.on('user joined', function(user) {
	console.log(user + ' joined room');
});

socket.on('answer received', function(data) {
	console.log(data + ' answered');
})

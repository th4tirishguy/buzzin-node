var socket = io();
var winnerDisplayed = false;
var currentUsers = [];
var displayName = $('#displayName').text();
var roomId = $('#roomId').text();

$(document).ready(function() {
	console.log(displayName);
	
	socket.emit('create', roomId, displayName);

	$('#answer').click(function() {
		socket.emit('answer', displayName);
	});

	$('#reset').click(function() {
		$('#firstClicked').text('N/A');
	})
});

socket.on('user joined', function(user) {
	console.log(user + ' joined room');
	socket.emit('request users');
	currentUsers.push(user);
	reloadList();
});

socket.on('answer received', function(data) {
	console.log(data + ' answered');
	if(winnerDisplayed == false) {
		$('#firstClicked').text(data);
		winnerDisplayed = true;
	}
});

socket.on('clear users', function() {
	currentUsers = [];
	socket.emit('request users');
});

socket.on('name request', function() {
	console.log('Name: ' + displayName + ' sent to server');
	socket.emit('name received', displayName);
});

socket.on('broadcast name', function(name) {
	var nameExists = false;
	for (var i = currentUsers.length - 1; i >= 0; i--) {
		if (currentUsers[i].toString() == name.toString()) {
			nameExists = true;
		}
	}
	if (nameExists == false) {
		currentUsers.push(name);
		reloadList();
	}
})

function reloadList() {
	$('#userList').empty();
	console.log('empty');
	for (var i = currentUsers.length - 1; i >= 0; i--) {
		addToList(currentUsers[i]);
	}
}

function addToList(u) {
	$('#userList').append('<li>' + u + '</li>');
}

function removeFromList(u) {
	currentUsers.splice(currentUsers.indexOf(u), 1);
	reloadList();
}
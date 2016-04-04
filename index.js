var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser')

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(cookieParser())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.render('index');
});

app.post('/join', function(req, res) {
	req.session.username = req.body.displayName;
	res.redirect('/room/' + req.body.roomId);
})

app.get('/room/:roomId', function(req, res) {
	if (req.session.username == null) {
		return res.redirect('/');
	}
	else {
		res.render('room', {roomId: req.params.roomId, displayName: req.session.username});
	}
});

// Socket io
io.sockets.on('connection', function(socket) {
	socket.on('create', function(room, user) {
		socket.join(room);
		io.sockets.in(room).emit('user joined', user)

		socket.on('answer', function(displayName) {
			io.sockets.in(room).emit('answer received', displayName);
		});

		socket.on('disconnect', function() {
			io.sockets.in(room).emit('clear users');
		});

		socket.on('request users', function() {
			io.sockets.in(room).emit('name request');
		});

		socket.on('name received', function(receivedName) {
			io.sockets.in(room).emit('broadcast name', receivedName);
		});
	});
});
// io.on('connection', function(socket){
// 	socket.on('user joined', function(user) {
// 		console.log(user);
// 	})
//   console.log('a user connected to the application');
// });


http.listen(3000, function() {
	console.log('Listening on port 3000');
});
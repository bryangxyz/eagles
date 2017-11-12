import openSocket from 'socket.io-client';
import axios from 'axios';

let socket = openSocket('http://localhost:3001');

axios.get('/port')
	.then(data => {
		console.log('port number is ', data);
		var url = 'http://localhost:' + data.data;
		console.log(url);
		socket = openSocket(url)


	})




let io = {
	sendMessage: function(data) {
		socket.emit('newMessage', data);
	},

	updateChat: function(cb) {
		console.log('working');
		socket.on('updateChat', function(data) {
			cb(data);
		})
	},
	renderChat: function(data) {
		socket.emit('renderChat', data)
	}

}




// socket.on('test', function(data) {
// 	console.log('test is', data);
// 	cb(data);
// });

export { io };
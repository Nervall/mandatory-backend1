const express = require('express');
const app = express();
//const http = require('http').createServer(app);
//const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.json());
const data = require('./data.json')



/* ==== objektet ======
const chat = { roomid: 1, room: "name",
    activity: {user: "name", message: "hey"}
		}
 */

app.get('/room', (req, res) => {
	res.json({data})
});

app.post('/room', (req, res) => {
	const addRoom = req.body;
	console.log(addRoom);

	res.end();
});

/*
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });
*/



const port = 3030;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
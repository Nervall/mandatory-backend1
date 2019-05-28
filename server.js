const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const port = 3030;

/* ==== objektet ======
const chat = {
    roomid: 1,
    room: "name",
    activity: {
        user: "name",
        message: "hey"
    }

}
 */

app.use(express.json());

app.get('/', (req,res) => {
    res.send('hello World')
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });





app.listen(port, () => console.log(`Server listening on port ${port}!`));
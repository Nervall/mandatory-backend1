const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const port = process.env.PORT || 3030;

app.use(express.json());
const data = require('./data.json')


fs.readFile('./data.json', 'utf-8', (err, data) => {
	if (err) {
		console.log(err)
	}
  data = JSON.parse(data);
  });

function getID() {
  let number = Math.floor((Math.random() * 10000) + 1);
  return number;
}

/*
{
  "rooms": [
    { "room" : {
				"id": 1, 
				"name": "Room1",
				"chat": [
						{ "user": "Jim", "message": "hey 1" },
						{ "user": "Pelle", "message": "hej igen 2" }
						]
				}
    },
    ]
 }
*/

app.get('/rooms', (req, res) => {
	res.json(data)
});

app.get('/rooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).end();
    return;
  }
    let room = data.rooms.find(data => data.room.id === id) 
    if (room) {
      res.json(room);
    } else {
      res.status(404).end();
    }
});

app.post('/rooms/', (req, res) => {
  const body = req.body;
  if (!body.name || typeof body.name !== 'string') {
    res.status(400).end();
    return;
  }
    let room = {
      id: getID(),
      name: body.name,
      chat: []
    };
    data.rooms.push({room})
    fs.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
      if (err) {
        console.log(err)
      }
        res.status(201).json(data);
      });
});


app.delete('/rooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if(!id) {
    res.status(400).end();
    return;
  }
  let roomIndex = data.rooms.findIndex(data => data.room.id === id) 
    if (roomIndex !== -1) {
      data.rooms.splice(roomIndex, 1);
      } 
      fs.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
        if (err) {
          console.log(err)
        }
        res.status(204).end();
        });  
});


  io.on('connection', (socket) => {
    socket.on('new message', (message) => {
      io.emit('new message', message)
      let id = message.id
      let roomIndex = data.rooms.find(x => x.room.id === id) 
        if (roomIndex !== -1) {
        let newChatMessage = roomIndex.room.chat
        newChatMessage.push(message.chat)
         
         fs.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
          if (err) {
            console.log(err)
          }
          })        
      } 
    });
  });


http.listen(port, () => {
  console.log('Server listening on ' + port);
});
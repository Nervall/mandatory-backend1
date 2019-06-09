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
console.log(data)

let counter = 100;
function getID() {
  return counter++;
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
		{ "room" : {
			"id": 2, 
			"name": "Room2",
			"chat": [
					{ "user": "Anders", "message": "hey babariba" },
					{ "user": "Agon", "message": "Yo whats up" }
					]
			}
    }
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
/*
app.post('/rooms/:id/', (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.id);
  let roomId = data.rooms.findIndex(data => data.room.id === id) 
  /*if (!body.name || typeof id !== Number || !req.params.id) {
    res.status(400).end();
    return;
  }
  room.chat.push({ user: body.user, message: body.message })
    /*const room = {
      id: roomId,
      name: roomName,
      chat: [ { user: body.user, message: body.message } ]
    };
    data.rooms.push({room})
    fs.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
      if (err) {
        console.log(err)
      }
        res.status(201).json({room});
      });
});


app.post('/rooms/:id/', (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.id);
  let roomId = data.rooms.findIndex(data => data.room.id === id) 
  if (!body.name || typeof id !== Number || !req.params.id) {
    res.status(400).end();
    return;
  }
  let room = {
    id: roomId,
    name: roomName,
    chat: [ { user: body.user, message: body.message } ]
  };
  data.rooms.push({room})
  fs.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
    if (err) {
      console.log(err)
    }
      res.status(201).json({room});
    });
});

*/

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
    console.log('a user connected');

    socket.on('add user', (username) => {
      socket.username = username;
      console.log(username+ ' connected')
    })
    socket.on('new message', (message) => {
      //console.log(message)
      //console.log(message.id)
      console.log(message.chat)
      let id = message.id
      //console.log(data)
      let roomIndex = data.rooms.find(x => x.room.id === id) 
        if (roomIndex !== -1) {
        console.log(roomIndex.room)
        console.log(roomIndex.room.chat)
        //console.log(data.rooms)
        let test = roomIndex.room.chat
        test.push(message.chat)
        //test.push(message.chat)
        //console.log(test)
        console.log(roomIndex.room.chat)
        console.log(roomIndex.room)
      } 
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  });



http.listen(port, () => {
  console.log('Server listening on ' + port);
});
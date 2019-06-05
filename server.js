const express = require('express');
const app = express();
//const http = require('http').createServer(app);
//const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.json());
const data = require('./data.json')


fs.readFile('./data.json', 'utf-8', (err, data) => {
	if (err) {
		console.log(err)
	}
  data = JSON.parse(data);
  });
console.log(data)

let counter = 3;
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
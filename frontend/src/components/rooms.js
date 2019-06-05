import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import io from 'socket.io-client';
import '../App.css';
//const socket = io('/rooms');



const Rooms = (props) => {
	const [data, updateData] = useState([]);
	const [chatData, updateChatData] = useState([]);
	const [newRoomName, updateNewRoomName] = useState('');
	const inputRoom = useRef(null);
	const chatWindow = useRef(null);

	useEffect(() => {
		axios.get('/rooms', {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				updateData(response.data.rooms);
			})
			.catch((error) => {
				console.log(error);
			})
  }, []);
		
		const user = props.user;
		//console.log(data)

	const roomName = (e) => {
		let roomValue = e.target.value;
		if (!roomValue || roomValue.length < 1) {
			console.log('error')
		return;
		} else {
			updateNewRoomName(roomValue)
		}
	}

	const getRoomChat = (e) => {
		let id = parseInt(e.target.id);
		axios.get('/rooms/'+id , {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				let data = (response.data.room.chat)
				updateChatData(data);
			})
			.catch((error) => {
				console.log(error);
			})
	}

	const deleteRoom = (e) => {
		let id = parseInt(e.target.id);
		console.log(id)
		axios.delete('/rooms/'+id , {headers: {"Content-Type": "application/json"}})
			/*.then((response) => {
				updateData(data);
				chatWindow.current.value = '';
			})*/
			.then(response => {
				const newData = [...data]
    		for(let i = 0; i < newData.length; i++){
      		if (i === id-1){
					newData.splice(i, 1)
      } 
    }  
		updateData(newData)
		})
		.catch((error) => {
			console.log(error);
		})
	}

		const createRoom = () => {
			axios.post('/rooms/', {name: newRoomName},{ headers: {"Content-Type": "application/json" }})
			.then((response) => {
				updateData(response.data.rooms)
				updateNewRoomName('');
				inputRoom.current.value = '';
				})
			.catch((error) => {
				console.log(error);
			})
	} 

		let renderRooms = (data) => {
			//console.log(data.room.id)
			return(
			<ul key={ data.room.id }>
				<li key={ data.room.id }> <Link to="/" onClick={ getRoomChat } id={data.room.id}> { data.room.name } </Link><span id={ data.room.id } onClick={ deleteRoom }> x</span></li>
			</ul>

			)}

		let renderChat = (chatData) => {
			if(!chatData) {
				return(
					<div>No content</div>
				)
			} else {
				for(let chat in chatData) {
				return(
					<div ref={ chatWindow }>
					<div>{ chatData.user }</div>
					<div>{ chatData.message }</div>
					</div>
				)
			}
			}
		}

		let mapRooms = data.map(renderRooms)
		let mapChat = chatData.map(renderChat)
			

  return (
		<>
		<header className='rooms-header-wrapper'>
			This is rooms, and I have username { user }
		</header>
		<aside>
			<div className='rooms-aside-wrapper'>
				<input onChange={ roomName } ref={ inputRoom } type='text' placeholder='Room name'></input><br />
				<button onClick={ createRoom }>Create new Room</button><br />
				<h3>Rooms</h3>
				{ mapRooms }
			</div>
		</aside>
		<main>
			<div className='rooms-main-wrapper'>Det här är main
			<div>{ mapChat }</div>
			</div>
		</main>
		</>
  );
}

export default Rooms;
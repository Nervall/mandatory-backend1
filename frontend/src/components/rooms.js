import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import io from 'socket.io-client';
import '../App.css';
//const socket = io('/rooms');



const Rooms = (props) => {
	const [data, updateData] = useState([]);
	const [newRoomName, updateNewRoomName] = useState('')
	const inputRoom = useRef(null)

	useEffect(() => {
		axios.get('/rooms', {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				//console.log(response.data.rooms)
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
			return(
				<>
			<ul key={ data.room.id }>
				<li key={ data.room.id }> <Link to="/"> { data.room.name } </Link></li>
			</ul>
			</>
			)}

		let renderChat = (data) => {
			//for (let obj in data.room) {
				//console.log(obj)
				for(let value of data.room.chat) {
				console.log(value)
				return(
					<>
					<div>{ value.user }</div>
					<textarea>{ value.message }</textarea>
					</>
				)
				//}
			}
		}

		let mapRooms = data.map(renderRooms)
		let mapChat = data.map(renderChat)
			

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
			{ mapChat }
			</div>
		</main>
		</>
  );
}

export default Rooms;
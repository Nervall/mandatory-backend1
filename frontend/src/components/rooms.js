import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../App.css';
const socket = io('http://localhost:3030');

function scrollBottom(){
	let element = document.querySelector(".rooms-main-chat-wrapper");
		element.scrollTop = element.scrollHeight;
  }


const Rooms = (props) => {
	const [data, updateData] = useState([]);
	const [roomData, updateRoomData] = useState(null)
	const [usersInRoom, updateUsersInRoom] = useState([])
	const [chatData, updateChatData] = useState([]);
	const [chatText, updateChatText] = useState('')
	const [roomId, updateRoomId] = useState('')
	const [roomNameHolder, updateRoomNameHolder] = useState('')
	const [disableButton, updateDisableButton] = useState(true)
	const [newRoomName, updateNewRoomName] = useState('');
	const inputRoom = useRef(null);
	const inputChat = useRef(null)

	const user = props.user;

	useEffect(() => {
		axios.get('/rooms', {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				updateData(response.data.rooms);
			})
			.catch((error) => {
				console.log(error);
			})
	}, []);

	useEffect(() => {
		socket.on('new message', (message) => {
			if (message.error) {
				return;
			}
			else if(roomId === message.id) {
				updateChatData([...chatData, message.chat])
				scrollBottom();
			} 
		})
	}, [chatData, roomId]);

	const roomName = (e) => {
		let roomValue = e.target.value;
		updateNewRoomName(roomValue)
	}

	const getRoomChat = (e) => {
		let id = parseInt(e.target.id);
		axios.get('/rooms/'+id , {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				updateChatData(response.data.room.chat);
				updateRoomData(response.data.room)
				updateRoomId(response.data.room.id)
				updateRoomNameHolder(response.data.room.name)
				updateDisableButton(false);
				uniqueUsers(response.data.room.chat)
			})
			.catch((error) => {
				console.log(error);
			})
	}

	const deleteRoom = (e) => {
		let id = parseInt(e.target.id);
		axios.delete('/rooms/'+id , {headers: {"Content-Type": "application/json"}})
			.then(response => {
				const newData = [...data]
    		for(let i = 0; i < newData.length; i++){
      		if (newData[i].room.id === id){
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
			if (newRoomName.length >= 1 && newRoomName.length <= 20) {
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
	} 

		const handleText = (e) => {
			let mess = e.target.value
			updateChatText(mess)
		}

		const sendMessage = (e) => {
			if (chatText.length >= 1 && chatText.length <= 200) {
			socket.emit('add user', user);
			let data = {
				id: roomData.id,
				name: roomData.name,
				chat: 
					{user: user, message: chatText}
			}
			socket.emit('new message', data)
			inputChat.current.value = '';	
			updateChatText('');
			}
		} 
		

		let renderRooms = (data) => {
			return(
				<div key={ data.room.id }className="rooms-aside-list-wrapper">
				<li key={ data.room.id } className="rooms-aside-list" onClick={ getRoomChat } id={data.room.id}> { data.room.name } <button id={ data.room.id } onClick={ deleteRoom } className="rooms-aside-delete"> x</button></li>
				</div>
			)}

			let renderChat = (chatData) => {
				scrollBottom();
				for(let chat in chatData) {
					return(
						<>
						<div className="rooms-main-user">{ chatData.user }</div>
						<div className="rooms-main-message">{ chatData.message }</div>
						</>
					)
				}
				
			}

		let uniqueUsers = (newUserList) => {
			let arr = []
			for(let hey in newUserList) {
				arr.push(newUserList[hey].user)
			}
			let users = [...new Set(arr)]
			updateUsersInRoom(users)		
		}



		let renderUser = (render) => {
				for(let chat in render) {
					return ( <li key={ render } className='rooms-aside-right-list'>{ render }</li>)
				}
			}
		

		let mapRooms = data.map(renderRooms)
		let mapChat = chatData.map(renderChat)
		let users = usersInRoom.map(renderUser);


  return (
		<>
		<header className='rooms-header-wrapper'>
			<div className='rooms-header-logo-wrapper'>
				<div className='rooms-header-heading'>Chat to you drop</div>
				User: { user }
			</div>
		</header>
		<aside>
			<div className='rooms-aside-wrapper'>
				<div className='rooms-aside-input-wrapper'>
				<input className='rooms-aside-input' minLength='1' maxLength='20' required onChange={ roomName } ref={ inputRoom } type='text' placeholder='Room name' /><br />
				<button className='rooms-aside-button' onClick={ createRoom }>Create new Room</button><br />
				</div>
				<h4>Rooms</h4>
				<ul>{ mapRooms }</ul>
			</div>
		</aside>
		<main>
			<div className='rooms-main-wrapper'>
			<h4> { roomNameHolder }</h4>
			<div className='rooms-main-chat-wrapper'>{ mapChat }</div>
			<div className='rooms-main-chat-message-wrapper'>
				<input minLength='1' maxLength='200' required className='rooms-main-chat-input' type="text" onChange={ handleText } ref={ inputChat }/><button disabled={ disableButton } className='rooms-main-chat-button' onClick={ sendMessage }>Send message</button>
			</div>
			</div>
	</main>
		<aside className='rooms-aside-right-wrapper'>
			<h4>Users in this room</h4>
				<ul>{ users }</ul>
		</aside>
		</>
  );
}

export default Rooms;
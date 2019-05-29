import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../App.css';
const socket = io('/room');



const Rooms = (props) => {
	const [data, updateData] = useState([]);

	useEffect(() => {
		axios.get('/room')
			.then((response) => {
				updateData(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			})
  }, [data]);
		
		const user = props.user;
		console.log(data)

		let users = () => {
			let arr = data;
			for (let i = 0; i < arr.length; i++) {
				console.log(arr[i].room);
				console.log(arr[i].roomid);
				let obj = arr[i].activity
				for (let j = 0; j < obj.length; j++) {
					console.log(obj[j])
					console.log(obj[j].user)
					console.log(obj[j].message)
				}
			}
		}

		users();

		let renderRooms = (data) => {
			return(
				<>
			<ul key={ data.roomid }>
				<li key={ data.roomid }> <Link to="/"> { data.room } </Link></li>
			</ul>
			</>
			)}

		let renderChat = (data) => (
				<>{ data.activity.map(item => 
					<>
					<div>{ item.user }</div>
					<div>{ item.message }</div>
					</>
					)}
				</>
		)
		
		/*{
			let arr = []
			for(let i = 0; i < data.activity.length; i++) {
				 arr.push(data.activity[i].user)
				 arr.push(data.activity[i].message)
			}
			return(
				<>
					<div>{ arr }</div>
				</>
			)}
*/
		let mapRooms = data.map(renderRooms)
		let mapChat = data.map(renderChat)
			

  return (
		<>
		<header className='rooms-header-wrapper'>
			This is rooms, and I have username { user }
		</header>
		<aside>
			<div className='rooms-aside-wrapper'>
				<input type='text' placeholder='Room name'></input><br />
				<button>Create new Room</button><br />
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
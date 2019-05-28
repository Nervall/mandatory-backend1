import React, {useState, useEffect, useRef} from 'react';
//import { Link } from 'react-router-dom';
import '../App.css';



const Rooms = (props) => {
		
		const user = props.user;
		console.log(user)



  return (
		<>
		<header className='rooms-header-wrapper'>
			This is rooms, and I have username { user }
		</header>
		<aside>
			<div className='rooms-aside-wrapper'>Det här är aside</div>
		</aside>
		<main>
			<div className='rooms-main-wrapper'>Det här är main</div>
		</main>
		</>
  );
}

export default Rooms;
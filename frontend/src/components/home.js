import React, {useState, useEffect, useRef} from 'react';
import { Link, Redirect } from "react-router-dom";
import Rooms from './rooms.js'
import axios from 'axios'
import '../App.css';



const Home = () => {
	const [userName, updateUserName] = useState('');
	const [error, updateError] = useState('');
	const [isLoggedIn, updateIsLoggedIn] = useState(false)

	const handleUserName = (e) => {
		updateUserName(e.target.value)
		console.log(userName)
	}

	const handleClick = (e) => {
		e.preventDefault();
		if (!userName || userName.length >= 20) {
			updateError('You have to choose a chatname between 1 to 20 digits');
		} else {
		updateError('');
		updateIsLoggedIn(true)
		}
	}

	if (!isLoggedIn) {
  return (
		<div className='home-wrapper'>
			<form className='home-form-wrapper'>
				<label htmlFor='name'>Ditt chatnamn</label><br />
				<input 
				type='text' 
				name='name' 
				placeholder='Your chatname' 
				onChange={ handleUserName } ></input><br />
				<button onClick={ handleClick }>Start chat</button>
				<p>{ error } </p> 
			</form>     
		</div>
	)} else {
		return ( <Rooms user={ userName }  ></Rooms> )
	}
}

export default Home;
import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../contexts/UserContext';
import Header from './Header';
import RenderFriends from './RenderFriends';

function Friends({history}) {
	const {user, getCurrentUserInfo} = useContext(UserContext);
	const [searchInput, setSearchInput] = useState('');


	useEffect(() => {
		getCurrentUserInfo(user._id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	
	const handleChange = (e) => {
		setSearchInput(e.target.value);
	};
	
	
	const filterSearch = () => {
		let friendsArray = user.friends;

		// filters the users based on search query
		if(searchInput) {
			friendsArray = friendsArray.filter(friend =>
				(friend.firstName + ' ' + friend.lastName).trim().toLowerCase().includes(searchInput.trim().toLowerCase())
			);
		};
		
		return friendsArray;
	};


	return (
		<div>
			<Header history={history} />
			
			<div className='content-body'>
				<form className='connect-form' onSubmit={(e) => e.preventDefault()}>
					<input 
						className='connect-input' 
						type='text' 
						onChange={handleChange} 
						placeholder='Search a friend...' 
						value={searchInput} 
					/>
				</form>
				
				<div className='connect-users-container'>
					<RenderFriends history={history} friends={filterSearch()} />
				</div>
			</div>
		</div>
	);
};

export default Friends;
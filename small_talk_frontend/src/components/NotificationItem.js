import React, {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';

function NotificationItem({notification}) {
	const {user, getCurrentUserInfo} = useContext(UserContext);
	
	// first param is user from, second param is logged in user, third param is current notification's id
	const acceptRequest = () => {
		fetch(`${process.env.REACT_APP_API_URL}/users/request-accepted/${notification.from._id}/${user._id}/${notification._id}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			},
			method: 'PUT'
		})
		.then(res => {
			if (res.ok) getCurrentUserInfo(user._id);
		});
	};
	
	
	// first param is user id, second param is current notification's id
	const declineRequest = () => {
		fetch(`${process.env.REACT_APP_API_URL}/users/request-declined/${user._id}/${notification._id}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			},
			method: 'PUT'
		})
		.then(res => {
			if (res.ok) getCurrentUserInfo(user._id);
		});
	};
		
	
	return (
		<div className='notifications-item-container'>
			<div className='notification-half'>
				<div className='notification-top'>
					<p className='notification-p bold'>Friend Request</p>
					<p className='notification-p bold'>{notification.dateCreated + ' ' + notification.timeCreated}</p>
				</div>
				
				<div className='notification-bottom'>
					<p className='notification-p'>{notification.body}</p>
				</div>
			</div>
			
			<div className='notification-second-half'>
				<button className='notification-request-button' onClick={acceptRequest}>Accept</button>
				<button className='notification-request-button' onClick={declineRequest}>Decline</button>
			</div>
		</div>
	);
};

export default NotificationItem;
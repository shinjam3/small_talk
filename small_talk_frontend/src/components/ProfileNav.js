import React, {useState, useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import {SocketContext} from '../contexts/SocketContext';

function ProfileNav({history, page}) {
	const {signOut} = useContext(UserContext);
	const {socket, clearSocket} = useContext(SocketContext);
	
	const [navExpandClass, setExpandClass] = useState('profile-nav-mobile');
	const [notificationsClass, setNotificationsClass] = useState('profile-nav-item active');
	const [editClass, setEditClass] = useState('profile-nav-item');
	const [settingsClass, setSettingsClass] = useState('profile-nav-item');
	const [logoutClass, setLogoutClass] = useState('profile-nav-item');
	
	
	const handleExpand = () => {
		if (navExpandClass==='profile-nav-mobile') {
			setNotificationsClass('profile-nav-item show');
			setEditClass('profile-nav-item show');
			setSettingsClass('profile-nav-item show');
			setLogoutClass('profile-nav-item show');
			setExpandClass('profile-nav-mobile open');
		}
		else {
			setNotificationsClass('profile-nav-item');
			setEditClass('profile-nav-item');
			setSettingsClass('profile-nav-item');
			setLogoutClass('profile-nav-item');
			setExpandClass('profile-nav-mobile');
		};
	};
	
	
	const handleNotificationsClick = () => {
		page('notifications');
		setNotificationsClass('profile-nav-item active');
		setEditClass('profile-nav-item');
		setSettingsClass('profile-nav-item');
		setLogoutClass('profile-nav-item');
		setExpandClass('profile-nav-mobile');
	};
	
	
	const handleEditClick = () => {
		page('edit');
		setNotificationsClass('profile-nav-item');
		setEditClass('profile-nav-item active');
		setSettingsClass('profile-nav-item');
		setLogoutClass('profile-nav-item');
		setExpandClass('profile-nav-mobile');
	};
	
	
	const handleSettingsClick = () => {
		page('settings');
		setNotificationsClass('profile-nav-item');
		setEditClass('profile-nav-item');
		setSettingsClass('profile-nav-item active');
		setLogoutClass('profile-nav-item');
		setExpandClass('profile-nav-mobile');
	};
	
	
	const handleLogout = () => {
		if (socket) {
			socket.emit('logOut');
			clearSocket();
			signOut();
			history.push('/');
		};
	};
	

	return (
		<div className='profile-nav-container'>
			<div className={navExpandClass} onClick={handleExpand}>&#9660;</div>
			<div className={notificationsClass} onClick={handleNotificationsClick}>Notifications</div>
			<div className={editClass} onClick={handleEditClick}>Edit Profile</div>
			<div className={settingsClass} onClick={handleSettingsClick}>Settings</div>
			<div className={logoutClass} onClick={handleLogout}>Log Out</div>
		</div>
	);
};

export default ProfileNav;
import React, {useContext, useEffect, useState} from 'react';
import {GroupContext} from '../contexts/GroupContext';
import {MessagesContext} from '../contexts/MessagesContext';
import {UserContext} from '../contexts/UserContext';
import {SocketContext} from '../contexts/SocketContext';

function GroupItem({group, history}) {
	const {leaveGroup} = useContext(GroupContext);
	const {getMessages} = useContext(MessagesContext);
	const {user} = useContext(UserContext);
	const {socket} = useContext(SocketContext);

	const [members, setMembers] = useState([]);
	const [messagesIconClass, setIconClass] = useState('messages-icon');
	const [deleteWarningClass, setWarningClass] = useState('messages-warning');
	const [latestMessage, setLatestMessage] = useState({
		sentBy: '',
		body: '',
		dateSent: '',
		timeSent: ''
	});	
	
	
	useEffect(() => {
		// fetches latest message for the group as a message preview
		fetch(`${process.env.REACT_APP_API_URL}/messages/${group._id}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			}
		})
		.then(res => res.json())
		.then(res => {
			if (!res.length) {
				setLatestMessage({
					sentBy: '',
					body: 'New Group',
					dateSent: new Date().toLocaleDateString(),
					timeSent: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
				});
			}
			else {
				if (res[0].sentBy==='') {
					setLatestMessage({
						sentBy: res[0].sentBy,
						body: res[0].body,
						dateSent: res[0].dateSent,
						timeSent: res[0].timeSent
					});
				}
				else {
					setLatestMessage({
						sentBy: res[0].sentBy+':',
						body: res[0].body,
						dateSent: res[0].dateSent,
						timeSent: res[0].timeSent
					});
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	
	useEffect(() => {
		setMembers(group.members.map(member => member.firstName));
	}, [group]);
	
	
	const handleClick = () => {
		getMessages(group._id);
		history.push(`/group/${group._id}`);
	};
	
	
	const showWarning = () => {
		setIconClass('messages-icon hide');
		setWarningClass('messages-warning show');
	};
	
	
	const deleteGroup = () => {
		leaveGroup(group._id, user._id);
		if (socket) {
			socket.emit('sendMessage', {message: {
				groupId: group._id,
				sentById: user._id,
				sentBy: '',
				body: user.firstName + ' has left the group.',
				dateSent: new Date().toLocaleDateString(),
				timeSent: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
			}});
		};
	};
	
	
	const cancelDelete = () => {
		setIconClass('messages-icon');
		setWarningClass('messages-warning');
	};
	

	return (
		<div className='messages-content'>
			<div className='messages-content-first-half' onClick={handleClick}>
				<div className='messages-half'>
					<p className='messages-p members'>{members.join(',')}</p>
					<p className='messages-p date'>{latestMessage.dateSent + ' ' + latestMessage.timeSent}</p>
				</div>
				
				<div className='messages-half'>
					<p className='messages-p message'>{latestMessage.sentBy + ' ' + latestMessage.body}</p>
				</div>
			</div>
						
			<div className='messages-content-second-half'>
				<p className={messagesIconClass} onClick={showWarning}>&#128465;</p>
				<div className={deleteWarningClass}>
					<p>Are you sure?</p>
					<div>
						<button onClick={deleteGroup}>Yes</button>
						<button onClick={cancelDelete}>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupItem;
import React, {useContext} from 'react';
import {MessagesContext} from '../contexts/MessagesContext';
import MessageItem from './MessageItem';

function RenderMessages() {
	const {messages} = useContext(MessagesContext);

	return (
		messages.map(message => <MessageItem message={message} key={message._id} /> )
	);
};

export default RenderMessages;
import React, {createContext, useReducer} from 'react';
import messagesReducer from '../reducers/messagesReducer';

const initialState = {
	messages: []
};

export const MessagesContext = createContext(initialState);

// provider component
export const MessagesProvider = ({children}) => {
	const [state, dispatch] = useReducer(messagesReducer, initialState)
	
	//actions
	function getMessages(groupId) {
		fetch(`${process.env.REACT_APP_API_URL}/messages/${groupId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			}
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'GET_MESSAGES',
				payload: res
			});
		});
	};

	function clearMessages() {
		dispatch({
			type: 'GET_MESSAGES',
			payload: []
		});
	};

	function addNewMessage(message) {
		dispatch({
			type: 'ADD_TO_MESSAGES',
			payload: message
		});
	};
	
	
	return (
		<MessagesContext.Provider value={{
			messages: state.messages,
			getMessages,
			clearMessages,
			addNewMessage
		}}>
			{children}
		</MessagesContext.Provider>
	);
};
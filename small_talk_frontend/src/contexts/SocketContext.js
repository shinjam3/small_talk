import React, {createContext, useReducer} from 'react';
import socketReducer from '../reducers/socketReducer';

const initialState = {
	socket: {}
};

export const SocketContext = createContext(initialState);


// provider component
export const SocketProvider = ({children}) => {
	const [state, dispatch] = useReducer(socketReducer, initialState)
	
	//actions
	function setSocket(socket) {
		dispatch({
			type: 'SET_SOCKET',
			payload: socket
		});
	};
	
	function clearSocket() {
		dispatch({
			type: 'SET_SOCKET',
			payload: {}
		});
	};
	
	
	return (
		<SocketContext.Provider value={{socket: state.socket,	setSocket, clearSocket}}>
			{children}
		</SocketContext.Provider>
	);
};
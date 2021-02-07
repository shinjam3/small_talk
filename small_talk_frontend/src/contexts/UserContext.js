import React, {createContext, useReducer} from 'react';
import userReducer from '../reducers/userReducer';

const initialState = {
	user: {
		_id: '',
		firstName: '',
		lastName: '',
		email: '',
		friends: [],
		notifications: []
	},
	loggedIn: false
};

export const UserContext = createContext(initialState);


// provider component
export const UserProvider = ({children}) => {
	const [state, dispatch] = useReducer(userReducer, initialState)
	
	//actions
	function saveUser(userInfo) {
		dispatch({
			type: 'SAVE_USER',
			payload: userInfo
		});
		
		dispatch({
			type: 'LOGIN_STATUS',
			payload: true
		});
	};
	
	function signOut() {
		localStorage.removeItem('token');
		dispatch({
			type: 'SAVE_USER',
			payload: {
				_id: '',
				firstName: '',
				lastName: '',
				email: '',
				pass: '',
				friends: [],
				notifications: []
			}
		});
		
		dispatch({
			type: 'LOGIN_STATUS',
			payload: false
		});
	};

	function getCurrentUserInfo(userId) {
		fetch(`${process.env.REACT_APP_API_URL}/users/current-user/${userId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			}
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'SAVE_USER',
				payload: res
			})
		});
	};

	function removeFriend(friendId, userId) {
		fetch(`${process.env.REACT_APP_API_URL}/users/remove-friend/${friendId}/${userId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			},
			method: 'PUT'
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'SAVE_USER',
				payload: res
			})
		});
	};
	
	
	return (
		<UserContext.Provider value={{
			user: state.user,
			loggedIn: state.loggedIn,
			saveUser,
			signOut,
			getCurrentUserInfo,
			removeFriend
		}}>
			{children}
		</UserContext.Provider>
	);
};
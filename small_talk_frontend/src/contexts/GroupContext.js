import React, {createContext, useReducer} from 'react';
import groupReducer from '../reducers/groupReducer';

const initialState = {
	groups: []
};

export const GroupContext = createContext(initialState);


// provider component
export const GroupProvider = ({children}) => {
	const [state, dispatch] = useReducer(groupReducer, initialState)
	
	//actions
	function getGroups(userId) {
		fetch(`${process.env.REACT_APP_API_URL}/groups/${userId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			}
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'GET_GROUPS',
				payload: res
			});
		});
	};

	function createNewGroup(userId) {
		fetch(`${process.env.REACT_APP_API_URL}/groups/create-group/${userId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			},
			method: 'POST'
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'ADD_TO_GROUPS',
				payload: res
			});
		});
	}

	function addToGroups(group) {
		dispatch({
			type: 'ADD_TO_GROUPS',
			payload: group
		})
	}

	function leaveGroup(groupId, userId) {
		fetch(`${process.env.REACT_APP_API_URL}/groups/leave-group/${groupId}/${userId}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"x-auth-token": localStorage.getItem('token')
			},
			method: 'PUT'
		})
		.then(res => res.json())
		.then(res => {
			dispatch({
				type: 'GET_GROUPS',
				payload: res
			});
		});
	}
	
	
	return (
		<GroupContext.Provider value={{
			groups: state.groups, 
			getGroups, 
			createNewGroup,
			addToGroups,
			leaveGroup
		}}>
			{children}
		</GroupContext.Provider>
	);
};
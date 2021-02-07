export default function messagesReducer(state, action) {
	switch(action.type) {
		case 'GET_MESSAGES': return {
			messages: action.payload
		}
		
		case 'ADD_TO_MESSAGES': return {
			messages: [action.payload, ...state.messages]
		}

		default: return state;
	}
}
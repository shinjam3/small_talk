export default function groupReducer(state, action) {
	switch (action.type) {
		case 'GET_GROUPS': return {
			groups: action.payload
		};
			
		case 'ADD_TO_GROUPS':	return {
			groups: [action.payload, ...state.groups]
		};
			
		default: return state;
	}
}
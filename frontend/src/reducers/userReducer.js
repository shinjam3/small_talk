export default function userReducer(state, action) {
  switch (action.type) {
    case "SAVE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGIN_STATUS":
      return {
        ...state,
        loggedIn: action.payload,
        isAuthenticating: false
      };

    default:
      return state;
  }
}

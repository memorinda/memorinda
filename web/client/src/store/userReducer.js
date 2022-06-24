export const USER_LOGIN = "APP/USER/USER_LOGIN";
export const ORGANIZER_LOGIN = "APP/USER/ORGANIZER_LOGIN";
export const USER_LOGOUT = "APP/USER/USER_LOGOUT";

const currUser = JSON.parse(localStorage.getItem("currentUser"));
const organizerUser = JSON.parse(localStorage.getItem("organizerUser"));

export const initialState = {
  user: currUser,
  organizerUser:organizerUser,
};

export const userLogin = (user) => ({
  type: USER_LOGIN,
  user,
});

export const organizerLogin = (user) => ({
  type: ORGANIZER_LOGIN,
  user,
}); 
export const userLogout = () => ({
  type: USER_LOGOUT,
});

export const userReducer = (state = initialState, action) => {
  if (action.type === USER_LOGIN) {
    localStorage.setItem("currentUser", JSON.stringify(action.user));
    return {
      ...state,
      user: action.user,
    };
  }else if (action.type === ORGANIZER_LOGIN) {
    localStorage.setItem("organizerUser", JSON.stringify(action.user));
    return {
      ...state,
      organizerUser: action.user,
    };
  }
  else if (action.type === USER_LOGOUT) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("organizerUser");
    return {
      ...state,
      user: null,
      organizerUser:null,
    };
  }
};


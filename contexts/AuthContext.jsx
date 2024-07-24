import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Arbaz",
  email: "arbazkamboh342@gmail.com",
  password: "12345678",
  avatar:
    "https://scontent.fkhi11-1.fna.fbcdn.net/v/t39.30808-1/347232137_263578229471118_5069170607590369080_n.jpg?stp=dst-jpg_p320x320&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHjlarvKBbvElNorpltosU3EDGu3geJrZcQMa7eB4mtl_WtEm8fbwqM7u9hzrMiwWTb89gAQI5Cfwo51Ta7Pkjk&_nc_ohc=MLINidF_z6oAX-ZMfSW&_nc_ht=scontent.fkhi11-1.fna&oh=00_AfDqasask9fivJiCBOqAqMw02aFlw_R5B-0gVQr9kcnx5Q&oe=65F7C5CA",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payLoad, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Action is not defined");
  }
}
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payLoad: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) return;
  return context;
}
export { AuthProvider, useAuth };

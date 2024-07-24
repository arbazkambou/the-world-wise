import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Arbaz",
  email: "test@gmail.com",
  password: "test1234",
  avatar:
    "https://scontent.fkhi11-1.fna.fbcdn.net/v/t39.30808-6/347232137_263578229471118_5069170607590369080_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHjlarvKBbvElNorpltosU3EDGu3geJrZcQMa7eB4mtl_WtEm8fbwqM7u9hzrMiwWTb89gAQI5Cfwo51Ta7Pkjk&_nc_ohc=_MPoyjCAomAQ7kNvgEaUMDO&_nc_zt=23&_nc_ht=scontent.fkhi11-1.fna&oh=00_AYB8nwgiewmIhxvvhUgFSNvw3El8TLKd-k3xdShl8aw1Eg&oe=66A6E6D0",
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

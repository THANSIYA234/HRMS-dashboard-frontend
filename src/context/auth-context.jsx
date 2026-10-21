import { createContext, useContext, useEffect, useState } from "react";
import { clearAuth, getToken } from "../utils/auth";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = getToken();

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        setUser,
        setToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

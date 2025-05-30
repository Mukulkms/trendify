import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("trendify_token");
      console.log("AuthContext - Token found:", token);
      if (token) {
        try {
          // Validate token with the backend
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Invalid or expired token");
          }
          const userData = await response.json();
          console.log("AuthContext - User data from backend:", userData);
          setUser(userData);
        } catch (error) {
          console.error("AuthContext - Error validating token:", error.message);
          localStorage.removeItem("trendify_token");
          setUser(null);
        }
      } else {
        console.log("AuthContext - No token found");
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("trendify_token", token);
    console.log("AuthContext - User logged in:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trendify_token");
    console.log("AuthContext - User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <div>Checking authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
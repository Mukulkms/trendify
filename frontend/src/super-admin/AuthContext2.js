import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext2 = createContext();

export const AuthProvider2 = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("trendify_admin_token");
      console.log("AuthContext2 - Token found:", token);

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/superAdminAuthRoutes/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Invalid or expired token");
          }

          const userData = await response.json();
          console.log("AuthContext2 - User data:", userData);

          if (
            userData.role === "super-admin" ||
            userData.role === "admin" ||
            userData.role === "vendor"
          ) {
            setUser(userData);
          } else {
            throw new Error("Unauthorized role");
          }
        } catch (err) {
          console.error("AuthContext2 - Error:", err.message);
          localStorage.removeItem("trendify_admin_token");
          setUser(null);
        }
      } else {
        console.log("AuthContext2 - No token found");
        setUser(null);
      }

      setLoading(false);
    };

    validateToken();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("trendify_admin_token", token);
    console.log("AuthContext2 - User logged in:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trendify_admin_token");
    console.log("AuthContext2 - User logged out");
  };

  return (
    <AuthContext2.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <div>Checking admin authentication...</div>}
    </AuthContext2.Provider>
  );
};

export const useAuth2 = () => {
  const context = useContext(AuthContext2);
  if (!context) {
    throw new Error("useAuth2 must be used within an AuthProvider2");
  }
  return context;
};

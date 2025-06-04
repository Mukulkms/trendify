import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext2 = createContext();

export const AuthProvider2 = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role;
    } catch (e) {
      console.error("Invalid token payload");
      return null;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("trendify_admin_token");
      if (!token) {
        console.log("AuthContext2 - No token found");
        setUser(null);
        setLoading(false);
        return;
      }

      const role = getRoleFromToken(token);

      let endpoint = '';
      if (role === 'super-admin') {
        endpoint = 'http://localhost:5000/api/superadmin-auth/me';
      } else if (role === 'admin' || role === 'vendor') {
        endpoint = 'http://localhost:5000/api/admin-vendor-auth/me';
      } else {
        console.error("AuthContext2 - Unknown role in token");
        localStorage.removeItem("trendify_admin_token");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || `HTTP ${response.status}`;
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }

        const userData = await response.json();

        // ⛔ Check for approval status
        if ((userData.role === 'vendor' || userData.role === 'admin') &&
          (!userData.isVerified || userData.status !== 'approved')) {
          console.warn("AuthContext2 - Account not approved yet.");
          localStorage.removeItem("trendify_admin_token");
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("AuthContext2 - Validation error:", err.message);
        if (err.message.includes("HTTP 401") || err.message.includes("HTTP 403")) {
          localStorage.removeItem("trendify_admin_token");
          setUser(null);
        }
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

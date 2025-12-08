import { createContext, useState, useEffect } from 'react';
import { users } from '../data/users';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password, role) => {
    // Find user matching all three criteria
    const foundUser = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = { id: foundUser.id, username: foundUser.username, role: foundUser.role };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid credentials or role mismatch' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

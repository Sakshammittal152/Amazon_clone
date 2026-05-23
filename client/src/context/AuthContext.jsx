import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
const defaultUser = {
  id: 1,
  name: 'Saksham',
  email: 'default@amazon-clone.local',
  isDefault: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    if (user) {
      if (user.isDefault) {
        localStorage.removeItem('token');
      }
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      setUser(defaultUser);
    }
  }, [user]);

  async function login(email, password) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function signup(name, email, password) {
    const data = await api('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(defaultUser);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

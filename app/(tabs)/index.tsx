import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Login from '../components/login';
import Home from '../components/home';

function Main() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; 
  }

  return user ? <Home /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
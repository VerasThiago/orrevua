import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Tickets from './pages/tickets';

import MainLayout from './layouts/mainLayout';
import PrivateRoute from './components/privateRoute';

import AuthProvider from './services/auth';

import './App.css';

export const AuthContext = createContext();

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route
              exact
              path="/tickets"
              element={
                <PrivateRoute>
                  <Tickets />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

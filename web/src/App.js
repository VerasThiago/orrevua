import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/home';
import Login from './pages/login';
import Tickets from './pages/tickets';

import PrivateRoute from './components/privateRoute';

import AuthProvider from './services/auth';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';

export const AuthContext = createContext();

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route>
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

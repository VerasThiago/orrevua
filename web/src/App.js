import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Landing from './pages/landing';
import Home from './pages/home';
import Login from './pages/login';
import Tickets from './pages/tickets';
import NotFound from './pages/notFound';

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
          <Route exact path="/home" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/404" element={<NotFound />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Landing from './pages/landing';
import Home from './pages/home';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import Tickets from './pages/tickets';
import NotFound from './pages/notFound';
import Users from './pages/admin/users';
import VerifyEmail from './pages/verifyEmail';

import AdminCreateTicket from './pages/admin/createTicket';
import AdminUserTickets from './pages/admin/userTickets';

import PrivateRoute from './components/privateRoute';

import AuthProvider from './services/auth';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import ResetPassword from './pages/resetPassword';
import SignUp from './pages/signUp ';

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
          <Route exact path="/forgot_password" element={<ForgotPassword />} />
          <Route exact path="/404" element={<NotFound />} />
          <Route
            exact
            path="/tickets"
            element={
              <PrivateRoute>
                <Tickets />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/admin/users"
            element={
              <PrivateRoute admin>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/admin/users/:userId"
            element={
              <PrivateRoute>
                <AdminUserTickets admin />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/admin/users/:userId/ticket/create"
            element={
              <PrivateRoute>
                <AdminCreateTicket admin />
              </PrivateRoute>
            }
          />
          <Route exact path="/password/reset" element={<ResetPassword />} />
          <Route exact path="/email/verify" element={<VerifyEmail />} />

          <Route exact path="/signup" element={<SignUp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

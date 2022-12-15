import React, { createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import Tickets from './pages/tickets';
import NotFound from './pages/notFound';
import Users from './pages/admin/users';
import VerifyEmail from './pages/verifyEmail';
import Profile from './pages/profile';

import AdminCreateTicket from './pages/admin/createTicket';
import AdminUserTickets from './pages/admin/userTickets';

import PrivateRoute from './components/privateRoute';

import AuthProvider from './services/auth';

import ResetPassword from './pages/resetPassword';
import SignUp from './pages/signUp ';
import UnauthorizedLayout from './layouts/unauthorizedLayout';

export const AuthContext = createContext();

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/login" replace />} />
          <Route
            exact
            path="/login"
            element={
              <UnauthorizedLayout>
                <Login />
              </UnauthorizedLayout>
            }
          />
          <Route
            exact
            path="/forgot_password"
            element={
              <UnauthorizedLayout>
                <ForgotPassword />
              </UnauthorizedLayout>
            }
          />
          <Route
            exact
            path="/password/reset"
            element={
              <UnauthorizedLayout>
                <ResetPassword />
              </UnauthorizedLayout>
            }
          />
          <Route
            exact
            path="/email/verify"
            element={
              <UnauthorizedLayout>
                <VerifyEmail />
              </UnauthorizedLayout>
            }
          />
          <Route
            exact
            path="/signup"
            element={
              <UnauthorizedLayout>
                <SignUp />
              </UnauthorizedLayout>
            }
          />
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
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
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
              <PrivateRoute admin>
                <AdminUserTickets />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/admin/users/:userId/ticket/create"
            element={
              <PrivateRoute admin>
                <AdminCreateTicket />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

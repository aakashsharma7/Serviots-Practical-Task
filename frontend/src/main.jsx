import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './index.css'

// Context & Auth Wrappers
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'

import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

// Pages (Lazy Loaded for Performance)
const Home = lazy(() => import('./pages/Home'));
const PetDetail = lazy(() => import('./pages/PetDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminPets = lazy(() => import('./pages/AdminPets'));
const AdminPetForm = lazy(() => import('./pages/AdminPetForm'));

// Base Layout
const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'auto' }}>
      &copy; {new Date().getFullYear()} PetAdopt. All rights reserved.
    </footer>
  </>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route element={
              <Suspense fallback={<div style={{ paddingTop: '20vh' }}><LoadingSpinner size="lg" text="Loading module..." /></div>}>
                <Outlet />
              </Suspense>
            }>
              {/* Public */}
              <Route index element={<Home />} />
              <Route path="pet/:id" element={<PetDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* User Protected */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Protected */}
              <Route path="admin">
                <Route path="applications" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="pets" element={
                  <AdminRoute>
                    <AdminPets />
                  </AdminRoute>
                } />
                <Route path="pets/new" element={
                  <AdminRoute>
                    <AdminPetForm />
                  </AdminRoute>
                } />
                <Route path="pets/edit/:id" element={
                  <AdminRoute>
                    <AdminPetForm />
                  </AdminRoute>
                } />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div className="page-container" style={{ textAlign: 'center', padding: '10vh 0' }}>
                  <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Page not found.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

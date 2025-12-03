import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RequireRole
 * - props.allowed: array of allowed roles (e.g. ['admin'])
 * - props.children: element to render when allowed
 *
 * The component reads `localStorage.user` (JSON) to check `role`.
 * If no user or role mismatch, it redirects to the login page (`/`).
 */
const RequireRole = ({ allowed = [], children }) => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return <Navigate to="/" replace />;

    const user = JSON.parse(raw);
    if (!user || !user.role) return <Navigate to="/" replace />;

    if (allowed.includes(user.role)) {
      return children;
    }
    // Role not allowed -> redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
};

export default RequireRole;

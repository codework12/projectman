
import React from 'react';
import AdminPanel from '../../pages/AdminPanel';
import AdminRoute from '../../components/auth/AdminRoute';

export default function Admin() {
  return (
    <>
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    </>
  );
}

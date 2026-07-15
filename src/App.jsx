import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AddArticlePage from './pages/AddArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import TransferPage from './pages/TransferPage';
import ScanPage from './pages/ScanPage';
import PrintArticlesPage from './pages/PrintArticlesPage';
import PrintQRPage from './pages/PrintQRPage';
import TrashedArticlesPage from './pages/TrashedArticlesPage';
import CategoriesPage from './pages/CategoriesPage';
import TransfersHistoryPage from './pages/TransfersHistoryPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'DM Sans', fontSize: '14px' },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } }
        }} />
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/add" element={<AddArticlePage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="articles/:id/edit" element={<EditArticlePage />} />
            <Route path="articles/:id/transfer" element={<TransferPage />} />
            <Route path="articles/scan" element={<ScanPage />} />
            <Route path="articles/print" element={<PrintArticlesPage />} />
            <Route path="articles/print-qr" element={<PrintQRPage />} />
            <Route path="articles/trashed" element={<TrashedArticlesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="transfers" element={<TransfersHistoryPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

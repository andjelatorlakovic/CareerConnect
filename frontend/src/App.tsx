import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { Role } from './models/auth/Role';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/protected_route/ProtectedRoute';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import MyJobsPage from './pages/company/MyJobsPage';
import CreateJobPage from './pages/company/CreateJobPage';
import MyJobDetailsPage from './pages/company/MyJobDetailsPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
          <Route
            path="/company-profile"
            element={
              <ProtectedRoute roles={[Role.Company]}>
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute roles={[Role.Company]}>
                <MyJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <ProtectedRoute roles={[Role.Company]}>
                <CreateJobPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/my-jobs/:id" 
            element={
            <MyJobDetailsPage />
          } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
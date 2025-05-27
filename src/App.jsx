// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme from './theme/theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';

// Pages
import ProjectList from './components/projects/ProjectList';
import ProjectDetails from './components/projects/ProjectDetails';
import CreateProject from './components/projects/CreateProject';
import TaskList from './components/tasks/TaskList';
import CategoryManager from './components/tasks/CategoryManager';
import EmployeeList from './components/employees/EmployeeList';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ProjectProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  {/* Dashboard - Redirect to projects */}
                  <Route index element={<Navigate to="/projects" replace />} />
                  
                  {/* Projects Routes */}
                  <Route path="projects" element={<ProjectList />} />
                  <Route path="projects/new" element={<CreateProject />} />
                  <Route path="projects/:id" element={<ProjectDetails />} />
                  <Route path="projects/:id/edit" element={<CreateProject />} />
                  
                  {/* Tasks Routes */}
                  <Route path="tasks" element={<TaskList />} />
                  
                  {/* Categories Routes */}
                  <Route path="categories" element={<CategoryManager />} />
                  
                  {/* Team/Employees Routes */}
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="team" element={<Navigate to="/employees" replace />} />
                  
                  {/* Catch all - redirect to projects */}
                  <Route path="*" element={<Navigate to="/projects" replace />} />
                </Route>
                
                {/* Catch all for non-authenticated users */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </ProjectProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
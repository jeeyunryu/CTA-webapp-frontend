import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import InspectionHistoryPage from './pages/InspectionHistoryPage';
import RepairmentHistoryPage from './pages/RepairmentHistoryPage';
import SignUpPage from './pages/SignUpPage';
// import PrivateRoute from './PrivateRoute';

// ----------------------------------------------------------------------

function protect (component) {
  console.log('location =', window.location.pathname)
  const isLoggedIn = window.localStorage.getItem('username')
  if (isLoggedIn) {
    return component
  }
  const pathname = window.location.pathname
  if (pathname !== '/login') {
    window.localStorage.setItem('savedPath', pathname)
  }
  return <Navigate to='/login' />
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'home', element: protect(<HomePage />) },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'inspection', element: <InspectionHistoryPage /> },
        { path: 'repairment', element: <RepairmentHistoryPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signUp',
      element: <SignUpPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

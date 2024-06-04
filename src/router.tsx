import { createBrowserRouter } from 'react-router-dom'
import { createProfileLoader } from './pages/Profile/create-profile-loader'
import { AppStore } from './lib/create-store'
import LayoutComponent from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

export const createRouter = ({ store }: { store: AppStore }) =>
  createBrowserRouter([
    {
      path: '/',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
    {
      path: '/login',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <Login />,
        },
      ],
    },
    {
      path: '/profile',
      element:<LayoutComponent/>,
      children: [
        {
          index: true,
          loader: createProfileLoader({ store }),
          element: <Profile />,
        },
      ],
    },
  ])

export type AppRouter = ReturnType<typeof createRouter>

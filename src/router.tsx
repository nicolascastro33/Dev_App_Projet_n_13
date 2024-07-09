import { createBrowserRouter } from 'react-router-dom'
import { createHomeLoader } from './pages/Home/create-home-loader'
import { AppStore } from './lib/create-store'
import Welcome from './pages/Welcome'
import LayoutComponent from './pages/Layout'
import Home from './pages/Home/home.layout'
import Login from './pages/Login'
import { createAccountLoader } from './pages/Account/create-account-loader'
import AccountLayout from './pages/Account/account.layout'

export const createRouter = ({ store }: { store: AppStore }) =>
  createBrowserRouter([
    {
      path: '/',
      element: <LayoutComponent />,
      children: [
        {
          element: <Welcome />,
          path: '*',
        },
        {
          element: <Welcome />,
          path: '',
        },
        {
          element: <Login />,
          path: 'login',
        },
        {
          element: <Home />,
          index: true,
          path: 'home',
          loader: createHomeLoader({ store }),
        },
        {
          element: <AccountLayout />,
          index:true,
          path: 'account/:id',
          loader: createAccountLoader({ store }),
        },
      ],
    },
  ])

export type AppRouter = ReturnType<typeof createRouter>

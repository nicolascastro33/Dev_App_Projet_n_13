import { createBrowserRouter } from 'react-router-dom'
import { createHomeLoader } from './pages/Home/create-home-loader'
import { AppStore } from './lib/create-store'
import Welcome from './pages/Welcome'
import LayoutComponent from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import { TransactionLayout } from './pages/Account/account.layout'

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
          element: <TransactionLayout />,
          path: 'account/:accountId',
        },
      ],
    },
  ])

export type AppRouter = ReturnType<typeof createRouter>

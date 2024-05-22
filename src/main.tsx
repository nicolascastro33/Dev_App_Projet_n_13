import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { createStore } from './lib/create-store'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Footer from './components/Footer'
import { FakeAuthGateway } from './lib/auth/infra/fake-auth.gateway'
import { FakeUserGateway } from './lib/user/infra/fake-user.gateway'

const store = createStore({
  authGateway: FakeAuthGateway.withAuthenticatedUser('Tony'),
  userGateway: FakeUserGateway.withUsersInfos(
    new Map([['Tony', { email: 't@t', firstName: 'Tony', lastName: 'Stark' }]])
  ),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  </React.StrictMode>
)

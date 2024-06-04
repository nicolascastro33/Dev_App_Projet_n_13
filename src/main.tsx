import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from './lib/create-store'

import { FakeAuthGateway } from './lib/auth/infra/fake-auth.gateway'
import { FakeUserGateway } from './lib/user/infra/fake-user.gateway'
import { mockData } from './Mock/data'
import { Provider } from './Provider'
import { createRouter } from './router'

const authGateway = new FakeAuthGateway()
authGateway.authUser = 'Tony'
const userGateway = new FakeUserGateway()
userGateway.userInfoByUser.set(authGateway.authUser, mockData)

const store = createStore({
  authGateway,
  userGateway,
})

const router = createRouter({ store })

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
)

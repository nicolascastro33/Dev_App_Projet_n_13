import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from './lib/create-store'

import { Provider } from './Provider'
import { createRouter } from './router'

import { ApiAuthGateway } from './lib/auth/infra/api-auth.gateway'
import { ApiUserGateway } from './lib/user/infra/api-user.gateway'
import { userAuthenticated } from './lib/auth/reducer'
import { ApiBankAccountGateway } from './lib/account/infra/api-acccount-info.gateway'
import { getAuthInfoProfileUser } from './lib/user/usecases/get-auth-info-profile-user'

const authGateway = new ApiAuthGateway()
const userGateway = new ApiUserGateway()
const accountGateway = new ApiBankAccountGateway()

const store = createStore({
  authGateway,
  userGateway,
  accountGateway,
})

const authUserToken = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

if (authUserToken && userId) {
  authGateway.token = authUserToken
  store.dispatch(userAuthenticated({ authUserToken, userId }))
  store.dispatch(getAuthInfoProfileUser())
}

const router = createRouter({ store })

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
)

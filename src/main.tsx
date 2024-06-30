import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from './lib/create-store'

import { Provider } from './Provider'
import { createRouter } from './router'

import { ApiAuthGateway } from './lib/auth/infra/api-auth.gateway'
import { userAuthenticated } from './lib/auth/reducer'
import { FakeTransactionsGateway } from './lib/transactions/infra/fake-transactions.gateway'
import { transactionsMockData, accountsMockData } from './Mock/data'
import { FakeAccountGateway } from './lib/account/infra/fake-account.gateway'
import { ApiProfileGateway } from './lib/profile/infra/api-profile.gateway'
import { getAuthInfoProfileUser } from './lib/profile/usecases/get-auth-info-profile-user'

const authGateway = new ApiAuthGateway()
const profileGateway = new ApiProfileGateway()
const accountGateway = new FakeAccountGateway()
accountGateway.allAccounts = accountsMockData
const transactionsGateway = new FakeTransactionsGateway()
transactionsGateway.allTransactions = transactionsMockData

const store = createStore({
  authGateway,
  profileGateway,
  accountGateway,
  transactionsGateway,
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

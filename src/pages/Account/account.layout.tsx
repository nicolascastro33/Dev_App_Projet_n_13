import { useSelector } from 'react-redux'
import { Transaction } from '../../components/Transaction'
import { RootState } from '../../lib/create-store'
import { ViewModelType, selectAccountViewModel } from './account-viewmodel'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'
import { ReactNode } from 'react'
import { Loading } from '../../components/Loading'
import { BankAccountInfo } from '../../components/BankAccountInfoAccountPage'
import { Link } from 'react-router-dom'

function AccountLayout() {
  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectAccountViewModel>
  >((rootState) => selectAccountViewModel(rootState))

  const bankAccountNode: ReactNode = (() => {
    switch (viewModel.account?.type) {
      case ViewModelType.NoAccount:
        return (
          <div className='account-page-no-accounts'>
            <h1>We didn't find this account, try an another moment</h1>
            <Link to='/home'><h2>Go back to your home page</h2></Link>
          </div>
        )
      case ViewModelType.LoadingAccount:
        return <Loading />
      case ViewModelType.NoTransactions:
        return (
          <>
            {' '}
            <BankAccountInfo
              name={viewModel.account.accountInfo.name}
              currency={viewModel.account.accountInfo.currency}
              amount={viewModel.account.accountInfo.amount}
              balance={viewModel.account.accountInfo.balance}
            />
            <h2>{viewModel.account.transactions} </h2>
          </>
        )
      case ViewModelType.WithTransactions:
        const info = viewModel.account.accountInfo
        const currency = info.currency
        return (
          <>
            <BankAccountInfo
              name={info.name}
              currency={currency}
              amount={info.amount}
              balance={info.balance}
            />
            <section className="all-transactions-wrapper">
              {viewModel.account.transactions.map((transaction, index) => (
                <Transaction
                  transaction={transaction}
                  currency={currency}
                  key={index}
                />
              ))}
            </section>
          </>
        )
      default:
        return exhaustiveGuard(viewModel.account)
    }
  })()

  return <main className="account-page-main">{bankAccountNode}</main>
}

export default AccountLayout

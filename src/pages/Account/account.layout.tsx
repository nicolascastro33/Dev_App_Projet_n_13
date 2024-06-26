import { useSelector } from 'react-redux'
import { Transaction } from '../../components/Transaction'
import { RootState } from '../../lib/create-store'
import { ViewModelType, selectAccountViewModel } from './account-viewmodel'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'
import { ReactNode } from 'react'
import { Loading } from '../../components/Loading'
import { BankAccountInfo } from '../../components/BankAccountInfoAccountPage'

function AccountLayout() {
  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectAccountViewModel>
  >((rootState) => selectAccountViewModel(rootState))

  const bankAccountNode: ReactNode = (() => {
    switch (viewModel.account?.type) {
      case ViewModelType.NoAccount:
        return <h1>We didn't find this account, try an another moment</h1>
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
        return (
          <>
            <BankAccountInfo
              name={viewModel.account.accountInfo.name}
              currency={viewModel.account.accountInfo.currency}
              amount={viewModel.account.accountInfo.amount}
              balance={viewModel.account.accountInfo.balance}
            />
            <section className="all-transactions-wrapper">
              {viewModel.account.transactions.map((transaction, index) => (
                <Transaction
                  transaction={transaction}
                  amount={viewModel.account.accountInfo.amount}
                  currency={viewModel.account.accountInfo.currency}
                  index={index}
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

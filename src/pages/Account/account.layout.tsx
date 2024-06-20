import { Transaction } from '../../components/Transaction'

const mockData = {
  id: 'cnt-1',
  name: 'Argent Bank Checking (x8349)',
  amount: '2,082.79',
  currency: '$',
  balance: 'Available',
  transactions: [
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
  ],
}

export const AccountLayout = () => {
  return (
    <main className="account-page-main">
      <section className="account-details-page">
        <h1 className="account-name">{mockData.name}</h1>
        <h2 className="account-amount">
          {mockData.currency}
          {mockData.amount}
        </h2>
        <h3 className="account-balance">{mockData.balance} Balance</h3>
      </section>
      <section className="all-transactions-wrapper">
        <h2 className="sr-only">transactions</h2>
        {mockData.transactions.map((transaction, index) => (
          <Transaction
            transaction={transaction}
            amount={mockData.amount}
            currency={mockData.currency}
            index={index}
            key={index}
          />
        ))}
      </section>
    </main>
  )
}

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

export const TransactionLayout = () => {
  return (
    <main>
      <section className="transaction-name">
        <h1>{mockData.name}</h1>
        <h2>
          {mockData.currency}
          {mockData.amount}
        </h2>
        <h3>{mockData.balance} Balance</h3>
      </section>
      <section>
        <h2 className="sr-only">transactions</h2>
        {mockData.transactions.map((transaction, index) => (
          <article key={index} className="transaction">
            <img src="/" alt="arrow" />
            <p>{transaction.date}</p>
            <p>{transaction.description}</p>
            <p>
              {mockData.currency}
              {5}
            </p>
            <p>
              {mockData.currency}
              {index === 0
                ? mockData.amount
                : Number(mockData.amount.replace(',', '')) - 5 * index}
            </p>
          </article>
        ))}
        <div>
          <h3>Transaction Type: Electronic</h3>
          <div>
            <h3>Category: Food</h3>

            <img src="/" alt="pencil" />
          </div>
          <div>
            <h3>Notes:</h3>
            <img src="/" alt="pencil" />
          </div>
        </div>
      </section>
    </main>
  )
}

export const BankAccounts = ({
  accounts,
}: {
  accounts: {
    name: string
    currency: string
    amount: string
    balance: string
  }[]
}) => {
  return (
    <div>
      <h2 className="sr-only">Accounts</h2>
      {accounts.map((account, index) => (
        <section key={index} className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">{account.name}</h3>
            <p className="account-amount">
              {account.currency}
              {account.amount}
            </p>
            <p className="account-amount-description">
              {account.balance} Balance
            </p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
      ))}
    </div>
  )
}

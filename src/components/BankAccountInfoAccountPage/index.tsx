export const BankAccountInfo = ({
  name,
  currency,
  amount,
  balance,
}: {
  name: string
  currency: string
  amount: string
  balance: string
}) => {
  return (
    <section className="account-details-page">
      <h1 className="account-name">{name}</h1>
      <h2 className="account-amount">
        {currency}
        {amount}
      </h2>
      <h3 className="account-balance">{balance} Balance</h3>
    </section>
  )
}

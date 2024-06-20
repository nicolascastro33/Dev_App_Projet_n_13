import { useState } from 'react'
import arrow from '../../assets/arrow-down-solid.svg'
import pencil from '../../assets/pen-solid.svg'

type TransactionProps = {
  date: string
  description: string
}

export const Transaction = ({
  transaction,
  currency,
  amount,
  index,
}: {
  transaction: TransactionProps
  currency: string
  amount: string
  index: number
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article className="transaction">
      <div onClick={() => setIsOpen(!isOpen)}>
        <img className="transaction-arrow" src={arrow} alt="arrow" />
        <p className="transaction-date">{transaction.date}</p>
        <p className="transaction-description">{transaction.description}</p>
        <p className="transaction-amount">
          {currency}
          {5}
        </p>
        <p className="transaction-balance">
          {currency}
          {index === 0 ? amount : Number(amount.replace(',', '')) - 5 * index}
        </p>
      </div>
      {isOpen && (
        <div className="transaction-details">
          <h3 className="transaction-details-type">
            Transaction Type: Electronic
          </h3>
          <div className="transaction-details-category">
            <h3>Category: Food</h3>
            <img src={pencil} alt="pencil" />
          </div>
          <div className="transaction-details-note">
            <h3>Notes:</h3>
            <img src={pencil} alt="pencil" />
          </div>
        </div>
      )}
    </article>
  )
}

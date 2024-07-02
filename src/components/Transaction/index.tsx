import { useState } from 'react'
import arrow from '../../assets/arrow-down-solid.svg'
import pencil from '../../assets/pen-solid.svg'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../lib/create-store'
import { updateTransactionInfo } from '../../lib/transactions/usecases/update-auth-transactions-infos-with-id'

type TransactionProps = {
  id: string
  date: string
  description: string
  accountId: string
  amount: string
  balance: string
  note: string | undefined
  category: string | undefined
}

export const Transaction = ({
  transaction,
  currency,
}: {
  transaction: TransactionProps
  currency: string
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [isEditingCategory, setIsEditingCategory] = useState(false)

  const EditingTransaction = ({
    type,
    transactionId,
    updateInfo,
  }: {
    type: string
    transactionId: string
    updateInfo(e: React.SyntheticEvent<HTMLFormElement>): void
  }) => {
    return (
      <form
        action="/"
        onSubmit={updateInfo}
        id={transactionId}
        className="edit-form-transaction"
      >
        <label htmlFor={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)} :
        </label>
        {type === 'note' ? (
          <textarea id="newInfo" name={type} />
        ) : (
          <input type="text" id="newInfo" name={type} />
        )}
        <button
          type="submit"
          name="update"
          className="edit-button-transaction update-transaction-button"
        >
          Save
        </button>
        <button
          type="submit"
          name="cancelChange"
          className="edit-button-transaction cancel-change-transaction"
        >
          Cancel
        </button>
      </form>
    )
  }

  const updateInfo = (e: any) => {
    e.preventDefault()
    const type = e.target.newInfo.name
    const transactionId = e.target.id
    if (e.nativeEvent.submitter.name === 'cancelChange') {
      if (type === 'note') setIsEditingNote(false)
      if (type === 'category') setIsEditingCategory(false)
      return
    }

    const newInfo =
      type === 'category' ? e.target.category.value : e.target.note.value
    dispatch(updateTransactionInfo({ transactionId, newInfo, type }))
      .unwrap()
      .finally(() => {
        if (type === 'note') setIsEditingNote(false)
        if (type === 'category') setIsEditingCategory(false)
      })
  }

  return (
    <article className="transaction">
      <div className="transaction-info" onClick={() => setIsOpen(!isOpen)}>
        <img className="transaction-arrow" src={arrow} alt="arrow" />
        <p className="transaction-date">{transaction.date}</p>
        <p className="transaction-description">{transaction.description}</p>
        <p className="transaction-amount">
          {currency}
          {transaction.amount}
        </p>
        <p className="transaction-balance">
          {currency}
          {transaction.balance}
        </p>
      </div>
      {isOpen && (
        <div className="transaction-details">
          <h3 className="transaction-details-type">
            Transaction Type: Electronic
          </h3>
          {isEditingCategory ? (
            <EditingTransaction
              transactionId={transaction.id}
              type="category"
              updateInfo={updateInfo}
            />
          ) : (
            <div className="transaction-details-category">
              <h3>
                Category: {transaction.category ? transaction.category : 'None'}
              </h3>
              <img
                src={pencil}
                alt="pencil"
                onClick={() => setIsEditingCategory(!isEditingCategory)}
              />
            </div>
          )}
          {isEditingNote ? (
            <EditingTransaction
              transactionId={transaction.id}
              type="note"
              updateInfo={updateInfo}
            />
          ) : (
            <div className="transaction-details-note">
              <h3>Notes: {transaction.note ? transaction.note : 'None'}</h3>
              <img
                src={pencil}
                alt="pencil"
                onClick={() => setIsEditingNote(!isEditingNote)}
              />
            </div>
          )}
        </div>
      )}
    </article>
  )
}

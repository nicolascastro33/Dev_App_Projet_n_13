export type TransactionsInfo = {
  id: string
  accountId: string
  date: string
  description: string
  amount: string
  balance: string
  category: string|undefined
  note: string | undefined
}

export type GetInfoTransactionsResponse = {
  transactionsInfo: TransactionsInfo[]
}



export interface TransactionsGateway {
  getTransactionsInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoTransactionsResponse>
  updateTransactionInfo({
    token,
    transactionId,
    type,
    newInfo,
  }: {
    token: string
    transactionId: string
    type: string
    newInfo: string
  }): Promise<{
    id: string
    note: string | undefined
    category: string | undefined
  }>
}

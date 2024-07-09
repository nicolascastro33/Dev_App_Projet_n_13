import {
  TransactionsGateway,
  TransactionsInfo,
  GetInfoTransactionsResponse,
} from '../model/transactions.gateway'

export class FakeTransactionsGateway implements TransactionsGateway {
  constructor(private readonly delay = 0) {}
  allTransactions: undefined | TransactionsInfo[] = undefined
  async getTransactionsInfo({
    accountId,
    token,
  }: { 
    accountId: string
    token: string
  }): Promise<GetInfoTransactionsResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(token)
        const allTransactions = this.allTransactions
        const transactionsInfo = allTransactions?.filter(
          (t) => t.accountId === accountId
        )
        if (!transactionsInfo) {
          return reject()
        }
        return resolve({
          transactionsInfo,
        })
      }, this.delay)
    )
  }
  async updateTransactionInfo({
    token,
    transactionId,
    newInfo,
    type,
  }: {
    token: string
    transactionId: string
    newInfo: string
    type: string
  }): Promise<{
    id: string
    note: string | undefined
    category: string | undefined
  }> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(token)
        if (!newInfo) {
          return reject()
        }
        return resolve({
          id: transactionId,
          note: type === 'note' ? newInfo : undefined,
          category: type === 'category' ? newInfo : undefined,
        })
      }, this.delay)
    )
  }
}

export const account = new FakeTransactionsGateway()

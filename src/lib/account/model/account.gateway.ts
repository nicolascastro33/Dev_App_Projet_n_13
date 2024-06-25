export type AccountInfo = {
  id: string
  name: string
  amount: string
  currency: string
  balance: string
  transactions: {
    date: string
    description: string
  }[]
}

export type GetInfoAccountResponse = {
  accountInfo: AccountInfo
}

export interface AccountGateway {
  getAccountInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoAccountResponse>
}

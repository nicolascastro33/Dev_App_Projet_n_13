export type AccountInfo = {
  id: string
  name: string
  amount: string
  currency: string
  balance: string
}

export type GetInfoAccountResponse = {
  accountInfo: AccountInfo
}

export type GetInfoAllAccountsResponse = {
  allAccounts: AccountInfo[]
}

export interface AccountGateway {
  getAccountInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoAccountResponse>
  getAllAccountsInfo({token}:{token:string}):Promise<GetInfoAllAccountsResponse>
}

import {
  AccountGateway,
  AccountInfo,
  GetInfoAccountResponse,
  GetInfoAllAccountsResponse,
} from '../model/account.gateway'

export class FakeAccountGateway implements AccountGateway {
  constructor(private readonly delay = 0) {}
  allAccounts: undefined | AccountInfo[] = undefined
  async getAccountInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoAccountResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const allAccounts = this.allAccounts
        const accountInfo = allAccounts?.find(
          (account) => account.id === accountId
        )

        if (!accountInfo) {
          return reject()
        }
        return resolve({ accountInfo })
      }, this.delay)
    )
  }
  getAllAccountsInfo({
    token,
  }: {
    token: string
  }): Promise<GetInfoAllAccountsResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const allAccounts = this.allAccounts
        if (!allAccounts) {
          return reject()
        }
        return resolve({ allAccounts })
      }, this.delay)
    )
  }
}

export const account = new FakeAccountGateway()

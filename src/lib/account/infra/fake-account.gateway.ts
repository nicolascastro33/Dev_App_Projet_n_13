import {
  AccountGateway,
  AccountInfo,
  GetInfoAccountResponse,
} from '../model/account.gateway'

export class FakeAccountGateway implements AccountGateway {
  constructor(private readonly delay = 0) {}
  accountInfoByAccountId = new Map<string, AccountInfo>()
  async getAccountInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoAccountResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(token)
        const accountInfo = this.accountInfoByAccountId.get(accountId)
        if (!accountInfo) {
          return reject()
        }
        return resolve({
          accountInfo,
        })
      }, this.delay)
    )
  }
}

export const account = new FakeAccountGateway()

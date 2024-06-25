import {
  AccountGateway,
  GetInfoAccountResponse,
} from '../model/account.gateway'

export class ApiBankAccountGateway implements AccountGateway {
  async getAccountInfo({
    accountId,
    token,
  }: {
    accountId: string
    token: string
  }): Promise<GetInfoAccountResponse> {
    const info = await responseCallApi({ accountId, token })
    return {
      accountInfo: info,
    }
  }
}

const responseCallApi = ({
  accountId,
  token,
}: {
  accountId: string
  token: string
}) => {
  console.log(accountId + token)
  return { ...mockData, id: accountId }
}

const mockData = {
  name: 'Argent Bank Checking (x8349)',
  amount: '2,082.79',
  currency: '$',
  balance: 'Available',
  transactions: [
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
    {
      date: 'June 13th, 2020',
      description: 'Payment from John Doe',
    },
  ],
}

export const accountGateway = new ApiBankAccountGateway()

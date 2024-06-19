import {
  GetInfoProfileResponse,
  UserGateway,
  UserInfos,
} from '../model/user.gateway'

export class FakeUserGateway implements UserGateway {
  constructor(private readonly delay = 0) {}
  userInfoByUser = new Map<string, UserInfos>()

  static withUsersInfos(usersInfos: Map<string, UserInfos>) {
    const userGateway = new FakeUserGateway()
    userGateway.userInfoByUser = usersInfos
    return userGateway
  }

  async updateInfoProfile({
    token,
    firstName,
    lastName,
    userId,
  }: {
    token: string
    firstName: string
    lastName: string
    userId: string
  }): Promise<{
    firstName: string
    lastName: string
    token: string
    userId: string
  }> {
    return { firstName, lastName, userId, token }
  }

  async getUserInfo({
    token,
  }: {
    token: string
  }): Promise<GetInfoProfileResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        console.log(token)
        const userInfo = this.userInfoByUser.get(token)
        if (!userInfo) {
          return reject()
        }
        return resolve({
          userInfo,
        })
      }, this.delay)
    )
  }
}

export const userGateway = new FakeUserGateway()

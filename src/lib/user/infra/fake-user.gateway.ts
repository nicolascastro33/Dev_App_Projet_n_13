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

  async getUserInfo({
    userId,
  }: {
    userId: string
  }): Promise<GetInfoProfileResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const userInfo = this.userInfoByUser.get(userId)
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

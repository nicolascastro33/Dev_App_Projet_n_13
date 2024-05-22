import { GetInfoProfileResponse, UserGateway, UserInfos } from '../model/user.gateway'

export class FakeUserGateway implements UserGateway {
  userInfoByUser = new Map<
    string,
    UserInfos
  >()

  static withUsersInfos(usersInfos: Map<string, UserInfos>) {
    const userGateway = new FakeUserGateway()
    userGateway.userInfoByUser = usersInfos
    return userGateway
  }

  async getInfoProfileUser({
    userId,
  }: {
    userId: string
  }): Promise<GetInfoProfileResponse> {
    const userInfo = this.userInfoByUser.get(userId)
    if (!userInfo) {
      return Promise.reject()
    }
    return Promise.resolve({
      userInfo
    })
  }
}

export const userGateway = new FakeUserGateway()

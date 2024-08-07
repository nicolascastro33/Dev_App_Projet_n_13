import {
  GetInfoProfileResponse,
  ProfileGateway,
  ProfileInfos,
} from '../model/profile.gateway'

export class FakeProfileGateway implements ProfileGateway {
  constructor(private readonly delay = 0) {}
  profileInfoByUser = new Map<string, ProfileInfos>()

  static withUsersInfos(usersInfos: Map<string, ProfileInfos>) {
    const userGateway = new FakeProfileGateway()
    userGateway.profileInfoByUser = usersInfos
    return userGateway
  }

  async updateInfoProfile({
    token,
    firstName,
    lastName,
  }: {
    token: string
    firstName: string
    lastName: string
  }): Promise<{
    firstName: string
    lastName: string
    token: string
  }> {
    return { firstName, lastName, token }
  }

  async getProfileInfo({
    token,
  }: {
    token: string
  }): Promise<GetInfoProfileResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const profileInfo = this.profileInfoByUser.get(token)
        if (!profileInfo) {
          return reject()
        }
        return resolve({
          profileInfo,
        })
      }, this.delay)
    )
  }
}

export const userGateway = new FakeProfileGateway()

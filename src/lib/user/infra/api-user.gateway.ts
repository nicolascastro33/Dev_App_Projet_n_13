import { GetInfoProfileResponse, UserGateway } from '../model/user.gateway'
import { getInfo } from '../../../fetch'
import { updateInfo } from '../../../fetch'

export class ApiUserGateway implements UserGateway {
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
    let response = await updateInfo({ token, firstName, lastName })
    if (!response) {
      return { firstName, lastName, token, userId }
    }
    const payload = {
      firstName: response.firstName,
      lastName: response.lastName,
      token,
      userId,
    }
    return payload
  }

  async getUserInfo({
    token,
  }: {
    token: string
  }): Promise<GetInfoProfileResponse> {
    const info = await getInfo(token)
    return {
      userInfo: { ...info},
    }
  }
}

export const userGateway = new ApiUserGateway()

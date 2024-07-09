import { getInfo } from '../../../fetch'
import { updateInfo } from '../../../fetch'
import {
  GetInfoProfileResponse,
  ProfileGateway,
} from '../model/profile.gateway'

export class ApiProfileGateway implements ProfileGateway {
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
  }> {
    let response = await updateInfo({ token, firstName, lastName })
    if (!response) {
      return { firstName, lastName }
    }
    const payload = {
      firstName: response.firstName,
      lastName: response.lastName,
    }
    return payload
  }

  async getProfileInfo({
    token,
  }: {
    token: string
  }): Promise<GetInfoProfileResponse> {
    const info = await getInfo(token)
    console.log(info)
    if (!info) localStorage.clear()
    return {
      profileInfo: { ...info },
    }
  }
}

export const profileGateway = new ApiProfileGateway()

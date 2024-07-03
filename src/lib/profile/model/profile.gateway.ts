export type ProfileInfos = {
  id: string
  firstName: string
  lastName: string
}

export type GetInfoProfileResponse = {
  profileInfo: ProfileInfos
}

export interface ProfileGateway {
  getProfileInfo({ token }: { token: string }): Promise<GetInfoProfileResponse>
  updateInfoProfile({
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
  }>
}

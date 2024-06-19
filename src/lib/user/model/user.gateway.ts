export type UserInfos = {
  id: string
  firstName: string
  lastName: string
}

export type GetInfoProfileResponse = {
  userInfo: UserInfos
}

export interface UserGateway {
  getUserInfo({ token }: { token: string }): Promise<GetInfoProfileResponse>
  updateInfoProfile({
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
  }>
}

export type UserInfos = {
  firstName: string
  lastName: string
  email: string
}

export type GetInfoProfileResponse = {
  userInfo: UserInfos
}

export interface UserGateway {
  getInfoProfileUser({
    userId,
  }: {
    userId: string
  }): Promise<GetInfoProfileResponse>
}

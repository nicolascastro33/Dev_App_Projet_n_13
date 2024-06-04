export type UserInfos = {
  user: string
  id: string
  profileInfo:{
    firstName:string
    lastName:string
    email:string
    password:string
  }
  accounts: {
    id: string
    name: string
    amount: string
    currency: string
    balance:string
  }[]
}

export type GetInfoProfileResponse = {
  userInfo: UserInfos
}

export interface UserGateway {
  getUserInfo({
    userId,
  }: {
    userId: string
  }): Promise<GetInfoProfileResponse>
}

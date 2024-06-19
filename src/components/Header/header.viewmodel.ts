import { useSelector } from 'react-redux'
import {
  selectAuthUserId,
  selectIsUserAuthenticated,
} from '../../lib/auth/reducer'
import { RootState } from '../../lib/create-store'
import { selectProfileForUser } from '../../lib/user/slices/profile.slice'

export enum HeaderViewModelType {
  UserNotConnected = 'USER_NOT_CONNECTED',
  UserConnected = 'USER_CONNECTED',
}

export type HeaderViewModel = {
  user:
    | {
        type: HeaderViewModelType.UserConnected
        firstName: string
      }
    | {
        type: HeaderViewModelType.UserNotConnected
      }
}

export const selectHeaderViewModel = (
  rootState: RootState
): HeaderViewModel => {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated)
  const userId = selectAuthUserId(rootState)
  const user = selectProfileForUser(userId, rootState)

  if (isUserAuthenticated && user) {
    return {
      user: {
        type: HeaderViewModelType.UserConnected,
        firstName: user?.firstName,
      },
    }
  }

  return {
    user: {
      type: HeaderViewModelType.UserNotConnected,
    },
  }
}

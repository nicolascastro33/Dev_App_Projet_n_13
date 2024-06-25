import { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectAuthUserId,
  selectIsUserAuthenticated,
} from '../../lib/auth/reducer'
import { HeaderViewAuthenticated, HeaderViewNotAuthenticated } from './view'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { authenticatedUserLogOut } from '../../lib/auth/usecases/authenticatedUserLogOut'
import { selectUserFirstName } from '../../lib/user/slices/profile.slice'

function Header() {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated)
  const userId = useSelector(selectAuthUserId)
  const firstName = useSelector<RootState>((rootState) =>
    selectUserFirstName(userId, rootState)
  )

  const navigate = useNavigate()
  const location = useLocation().pathname
  const dispatch = useDispatch<AppDispatch>()

  function signOut(e: MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault()
    dispatch(authenticatedUserLogOut())
    if (location !== '/') {
      navigate('/login')
    }
  }
  if (isUserAuthenticated && firstName) {
    return <HeaderViewAuthenticated signOut={signOut} firstName={`${firstName}`} />
  }
  return <HeaderViewNotAuthenticated />
}
export default Header

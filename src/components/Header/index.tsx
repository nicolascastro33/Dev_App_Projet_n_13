import { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsUserAuthenticated } from '../../lib/auth/reducer'
import {
  HeaderViewAuthenticated,
  HeaderViewAuthenticatedButWithAProblem,
  HeaderViewNotAuthenticated,
} from './view'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { authenticatedUserLogOut } from '../../lib/common/usecases/authenticatedUserLogOut'
import { selectUserFirstName } from '../../lib/profile/slices/profile.slice'

function Header() {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated)
  const firstName = useSelector<RootState>((rootState) =>
    selectUserFirstName(rootState)
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
    return (
      <HeaderViewAuthenticated signOut={signOut} firstName={`${firstName}`} />
    )
  }
  if (isUserAuthenticated) {
    return <HeaderViewAuthenticatedButWithAProblem signOut={signOut} />
  }
  return <HeaderViewNotAuthenticated />
}
export default Header

import { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsUserAuthenticated } from '../../lib/auth/reducer'
import { HeaderViewAuthenticated, HeaderViewNotAuthenticated } from './view'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { authenticatedUserLogOut } from '../../lib/auth/usecases/authenticatedUserLogOut'
import {
  ViewModelType,
  selectViewModel,
} from '../../viewModel/viewmodel'

function Header() {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated)
  const navigate = useNavigate()
  const location = useLocation().pathname
  const dispatch = useDispatch<AppDispatch>()

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectViewModel>
  >((rootState) => selectViewModel(rootState))

  function signOut(e: MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault()
    dispatch(authenticatedUserLogOut())
    if (location !== '/') {
      navigate('/login')
    }
  }
  if (
    isUserAuthenticated &&
    viewModel.user.type !== ViewModelType.NoProfile &&
    viewModel.user.type !== ViewModelType.LoadingAccount
  ) {
    return (
      <HeaderViewAuthenticated
        signOut={signOut}
        firstName={viewModel.user.firstName}
      />
    )
  }
  return <HeaderViewNotAuthenticated />
}
export default Header

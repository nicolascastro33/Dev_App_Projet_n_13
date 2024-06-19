import { MouseEvent, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HeaderViewAuthenticated, HeaderViewNotAuthenticated } from './view'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { authenticatedUserLogOut } from '../../lib/auth/usecases/authenticatedUserLogOut'
import { HeaderViewModelType, selectHeaderViewModel } from './header.viewmodel'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'

function Header() {
  const navigate = useNavigate()
  const location = useLocation().pathname
  const dispatch = useDispatch<AppDispatch>()

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectHeaderViewModel>
  >((rootState) => selectHeaderViewModel(rootState))
  console.log(viewModel.user.type)

  const headerNode: ReactNode = (() => {
    switch (viewModel.user?.type) {
      case HeaderViewModelType.UserNotConnected:
        return <HeaderViewNotAuthenticated />
      case HeaderViewModelType.UserConnected:
        return (
          <HeaderViewAuthenticated
            signOut={signOut}
            firstName={viewModel.user.firstName}
          />
        )
      default:
        return exhaustiveGuard(viewModel.user)
    }
  })()


  function signOut(e: MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault()
    dispatch(authenticatedUserLogOut())
    if (location !== '/') {
      navigate('/login')
    }
  }

  return <header>{ headerNode }</header>
}
export default Header

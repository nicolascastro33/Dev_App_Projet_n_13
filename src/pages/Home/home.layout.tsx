import { MouseEvent, useState, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { ViewModelType, selectHomeViewModel } from './home-viewmodel'
import { Text } from '@chakra-ui/react'
import { BankAccounts } from '../../components/BankAccountHomePage'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'
import WelcomeProfile from '../../components/WelcomeProfile'
import { updateInfoProfile } from '../../lib/profile/usecases/update-info-profile-user'
import { Loading } from '../../components/Loading'
import { useNavigate } from 'react-router-dom'
import { authenticatedUserLogOut } from '../../lib/common/usecases/authenticatedUserLogOut'

function Home() {
  const [editingName, setEditingName] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  function signOut(e: any): void {
    e.preventDefault()
    dispatch(authenticatedUserLogOut())
      .unwrap()
      .finally(() => {
        navigate('/login')
      })
  }

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectHomeViewModel>
  >((rootState) => selectHomeViewModel(rootState))

  const profileNode: ReactNode = (() => {
    switch (viewModel.user?.type) {
      case ViewModelType.NoProfile:
        document.title = 'Argent Bank - No Profile'
        return (
          <div className="home-page-no-profile">
            <h1>We can't reach your account</h1>
            <h2 onClick={signOut}>Try to log in again</h2>
          </div>
        )
      case ViewModelType.LoadingAccount:
        return <Loading />
      case ViewModelType.EmptyProfile:
        document.title = `Argent Bank - Welcome ${viewModel.user.firstName} ${viewModel.user.lastName}`
        return (
          <>
            <WelcomeProfile
              userProfile={viewModel.user}
              editName={editName}
              changeName={changeName}
              editingName={editingName}
            />
            <Text>{viewModel.user.accountInfo}</Text>
          </>
        )
      case ViewModelType.WithAccounts:
        document.title = `Argent Bank - Welcome ${viewModel.user.firstName} ${viewModel.user.lastName}`
        return (
          <>
            <WelcomeProfile
              userProfile={viewModel.user}
              editName={editName}
              changeName={changeName}
              editingName={editingName}
            />
            <h2 className="sr-only">Accounts</h2>
            <BankAccounts accounts={viewModel.user.accountInfo} />
          </>
        )
      case ViewModelType.UpdateInfoProfile:
        document.title = `Argent Bank - Welcome ${viewModel.user.firstName} ${viewModel.user.lastName}`
        return (
          <>
            <WelcomeProfile
              userProfile={viewModel.user}
              editName={editName}
              changeName={changeName}
              editingName={editingName}
            />
            <h2 className="sr-only">Accounts</h2>
            <BankAccounts accounts={viewModel.user.accountInfo} />
            <Loading />
          </>
        )

      default:
        return exhaustiveGuard(viewModel.user)
    }
  })()

  function editName(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    if (!editingName) setEditingName(true)
  }

  function changeName(e: any): void {
    e.preventDefault()
    if (e.nativeEvent.submitter.name === 'changeName') {
      const firstName =
        e.target.firstName.value.length === 0
          ? e.target.firstName.placeholder
          : e.target.firstName.value
      const lastName =
        e.target.lastName.value.length === 0
          ? e.target.lastName.placeholder
          : e.target.lastName.value
      dispatch(
        updateInfoProfile({
          firstName,
          lastName,
        })
      )
        .unwrap()
        .finally(() => {
          setEditingName(false)
        })
    } else if (e.nativeEvent.submitter.name === 'cancelChange') {
      setEditingName(false)
    }
  }

  return <main className="main bg-dark main-home">{profileNode}</main>
}

export default Home

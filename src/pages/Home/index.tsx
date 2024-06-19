import { MouseEvent, useState, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/create-store'
import { ProfileViewModelType, selectProfileViewModel } from './home.viewmodel'
import { Text } from '@chakra-ui/react'
import { BankAccounts } from '../../components/BankAccount'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'
import WelcomeProfile from '../../components/WelcomeProfile'
import { updateInfoProfile } from '../../lib/user/usecases/update-info-profile-user'
import { Loader } from '../../utils/loader'


function Home() {
  const [editingName, setEditingName] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectProfileViewModel>
  >((rootState) => selectProfileViewModel(rootState))

  const bankAccountNode: ReactNode = (() => {
    switch (viewModel.user?.type) {
      case ProfileViewModelType.NoProfile:
        return null
      case ProfileViewModelType.LoadingAccount:
        return (
          <div className='loader-wrapper'>
            <Loader />
          </div>
        )

      case ProfileViewModelType.EmptyProfile:
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
      case ProfileViewModelType.WithAccounts:
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

  return <main className="main bg-dark">{bankAccountNode}</main>
}

export default Home

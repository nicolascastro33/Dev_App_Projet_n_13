import { MouseEvent, useState, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../lib/create-store'
import {
  ProfileViewModelType,
  selectProfileViewModel,
} from './profile.viewmodel'
import { Text } from '@chakra-ui/react'
import { BankAccounts } from '../../components/BankAccount'
import { exhaustiveGuard } from '../../lib/common/exhaustive-guards'
import WelcomeProfile from '../../components/WelcomeProfile'

function Profile() {
  const [editingName, setEditingName] = useState(false)

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectProfileViewModel>
  >((rootState) => selectProfileViewModel(rootState))

  const bankAccountNode: ReactNode = (() => {
    switch (viewModel.user?.type) {
      case ProfileViewModelType.NoProfile:
        return null
      case ProfileViewModelType.LoadingAccount:
        return <Text>{viewModel.user.accountInfo}</Text>
      case ProfileViewModelType.EmptyProfile:
        return (
          <>
            <WelcomeProfile
              userProfile={viewModel.user.profileInfo}
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
              userProfile={viewModel.user.profileInfo}
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
      console.log(firstName + ' ' + lastName)
    }
    setEditingName(false)
  }

  return <main className="main bg-dark">{bankAccountNode}</main>
}

export default Profile

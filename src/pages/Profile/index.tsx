import { MouseEvent, useState, ReactNode, useEffect } from 'react'
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
  const [profileInfo, setProfileInfo] = useState({firstName:"", lastName:""})

  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectProfileViewModel>
  >((rootState) => selectProfileViewModel(rootState))

  useEffect(() => {
    const type = viewModel.user.type
    if (
      type === ProfileViewModelType.EmptyProfile ||
      type === ProfileViewModelType.WithAccounts
    ) {
      const newData = viewModel.user.profileInfo
      if(newData)setProfileInfo(newData)
    }
  }, [])

  const bankAccountNode: ReactNode = (() => {
    switch (viewModel.user?.type) {
      case ProfileViewModelType.NoProfile:
        return null
      case ProfileViewModelType.EmptyProfile:
        return <Text>{viewModel.user.accountInfo}</Text>
      case ProfileViewModelType.WithAccounts:
        return <BankAccounts accounts={viewModel.user.accountInfo} />
      default:
        return exhaustiveGuard(viewModel.user)
    }
  })()

  const [editingName, setEditingName] = useState(false)
  const userProfile = {
    firstName: 'Tony',
    lastName: 'Stark',
  }

  function editName(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    if (!editingName) setEditingName(true)
  }

  function changeName(e: any): void {
    e.preventDefault()
    if (e.nativeEvent.submitter.name === 'changeName') {
      const firstName =
        e.target.firstName.value.length === 0
          ? userProfile.firstName
          : e.target.firstName.value
      const lastName =
        e.target.lastName.value.length === 0
          ? userProfile.lastName
          : e.target.lastName.value
      console.log(firstName + ' ' + lastName)
    }
    setEditingName(false)
  }
  return (
    <main className="main bg-dark">
      {profileInfo && (
        <WelcomeProfile
          userProfile={profileInfo}
          editName={editName}
          changeName={changeName}
          editingName={editingName}
        />
      )}

      <h2 className="sr-only">Accounts</h2>
      {bankAccountNode}
    </main>
  )
}

export default Profile

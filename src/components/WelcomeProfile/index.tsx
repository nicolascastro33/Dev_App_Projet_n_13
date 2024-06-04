import { MouseEvent } from 'react'

interface WelcomeProfileProps {
  userProfile: {
    firstName: string
    lastName: string
  }
  editName(e: MouseEvent<HTMLButtonElement>): void
  changeName(e: React.SyntheticEvent<HTMLFormElement>): void
  editingName: boolean
}

function WelcomeProfile({
  userProfile,
  editName,
  changeName,
  editingName,
}: WelcomeProfileProps) {
  return (
      <div className="header">
        {editingName ? (
          <>
            <h1>Welcome back</h1>
            <form onSubmit={changeName} className='editingNameForm'>
              <div className="input-wrapper-change">
                <input
                  type="text"
                  id="firstName"
                  placeholder={userProfile?.firstName}
                />
              </div>
              <div className="input-wrapper-change">
                <input
                  type="text"
                  id="lastName"
                  placeholder={userProfile?.lastName}
                />
              </div>
              <button type="submit" name='changeName'  className="edit-button save-new-name-button">
                Save
              </button>
              <button type="submit" name='cancelChange'  className="edit-button cancel-change-name">
                Cancel
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>
              Welcome back
              <br />
              {userProfile?.firstName} {userProfile?.lastName}
            </h1>
            <button onClick={editName} className="edit-button">
              Edit Name
            </button>
          </>
        )}
      </div>
  )
}
export default WelcomeProfile

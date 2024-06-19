import { useState } from 'react'
import LoginView from './view'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../lib/create-store'
import { authenticateWithApi } from '../../lib/auth/usecases/authenticate-with-api.usecase'

function Login() {
  const [wrongPasswordOrEmail, setWrongPasswordOrEmail] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const authWithApi = (e: any): void => {
    e.preventDefault()
    console.log(e.target.rememberMe.checked)
    setAuthenticating(true)
    dispatch(
      authenticateWithApi({
        email: e.target.username.value,
        password: e.target.password.value,
        rememberMe: e.target.rememberMe.checked
      })
    )
      .unwrap()
      .finally(() => {
        setAuthenticating(false)
        const token = localStorage.getItem('token')
        if (token) {
          setWrongPasswordOrEmail(false)
        } else {
          setWrongPasswordOrEmail(true)
        }
      })
  }

  return (
    <LoginView
      loginSubmit={authWithApi}
      wrongPasswordOrEmail={wrongPasswordOrEmail}
      authenticating={authenticating}
    />
  )
}

export default Login

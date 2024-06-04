import { useState } from 'react'
import LoginView from './view'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [wrongPasswordOrEmail, setWrongPasswordOrEmail] = useState(false)
  const navigate = useNavigate()
  function loginSubmit(e: any): void {
    e.preventDefault()
    if (e.target.password.value === '123' && e.target.username.value === 'tony@stark.com') {
      setWrongPasswordOrEmail(false)
      navigate("/profile")
    } else {
      setWrongPasswordOrEmail(true)
    }
  }

  return (
    <LoginView
      loginSubmit={loginSubmit}
      wrongPasswordOrEmail={wrongPasswordOrEmail}
    />
  )
}

export default Login

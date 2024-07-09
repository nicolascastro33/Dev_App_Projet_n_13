import Logo from '../../assets/argentBankLogo.png'
import { Link } from 'react-router-dom'
import { MouseEvent } from 'react'

interface HeaderViewProps {
  firstName: string
  signOut(e: MouseEvent<HTMLAnchorElement>): void
}

interface HeaderProblemViewProps {
  signOut(e: MouseEvent<HTMLAnchorElement>): void
}

export const HeaderViewNotAuthenticated = () => {
  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={Logo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      <div>
        <Link className="main-nav-item" to="/login">
          <i className="fa fa-user-circle" />
          Sign In
        </Link>
      </div>
    </nav>
  )
}

export const HeaderViewAuthenticated = ({
  signOut,
  firstName,
}: HeaderViewProps) => {
  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={Logo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        <Link className="main-nav-item" to="/home">
          <i className="fa fa-user-circle" />
          {firstName}
        </Link>
        <a onClick={signOut} className="main-nav-item" href="./index.html">
          <i className="fa fa-sign-out" />
          Sign Out
        </a>
      </div>
    </nav>
  )
}

export const HeaderViewAuthenticatedButWithAProblem = ({
  signOut
}: HeaderProblemViewProps) => {
  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={Logo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      <div>
        <a onClick={signOut} className="main-nav-item" href="./index.html">
          <i className="fa fa-sign-out" />
          Sign Out
        </a>
      </div>
    </nav>
  )
}

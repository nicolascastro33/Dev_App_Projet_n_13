import Logo from '../../assets/argentBankLogo.png'
import { Link } from 'react-router-dom'
import { MouseEvent } from 'react'

interface HeaderViewProps {
    isItProfilePage: boolean
    firstName: string
    signOut(e:MouseEvent<HTMLAnchorElement>): void
}

function HeaderView({signOut, isItProfilePage, firstName}:HeaderViewProps) {
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
      {isItProfilePage ? (
        <div>
          <a className="main-nav-item" href="./user.html">
            <i className="fa fa-user-circle" />
            {firstName}
          </a>
          <a onClick={signOut} className="main-nav-item" href="./index.html">
            <i className="fa fa-sign-out" />
            Sign Out
          </a>
        </div>
      ) : (
        <div>
          <Link className="main-nav-item" to="/login">
            <i className="fa fa-user-circle" />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
export default HeaderView

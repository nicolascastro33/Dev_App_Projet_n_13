import { useEffect, useState,MouseEvent } from 'react'
import HeaderView from './view'
import { useLocation, useNavigate } from 'react-router-dom'


function Header() {
  const [isItProfilePage, setProfilePage] = useState(false)
  const location = useLocation().pathname
  const navigate = useNavigate()

  function signOut(e:MouseEvent<HTMLAnchorElement> ):void {
    e.preventDefault()
    navigate('/')
  }

  useEffect(() => {
    if (location === '/profile') {
      setProfilePage(true)
    } else {
      setProfilePage(false)
    }
  }, [location])

  return <HeaderView signOut={signOut} isItProfilePage={isItProfilePage} firstName="Tony" />
}
export default Header

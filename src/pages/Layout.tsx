import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsUserAuthenticated } from '../lib/auth/reducer'

function LayoutComponent() {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated)
  const navigate = useNavigate()
  const location = useLocation().pathname

  useEffect(() => {
    if (!isUserAuthenticated) {
      if (location !== '/login' && location !== '/') {
        navigate('/login')
      }
    }

    if (location === '/login' && isUserAuthenticated) {
      navigate('/home')
    }
  }, [location, isUserAuthenticated])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutComponent

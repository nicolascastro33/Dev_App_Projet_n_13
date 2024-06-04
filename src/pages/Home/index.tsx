import IconSecurity from '../../assets/icon-security.png'
import IconMoney from '../../assets/icon-money.png'
import IconChat from '../../assets/icon-chat.png'
import { useEffect, useState } from 'react'

function Home() {
  const [token, setToken] = useState()
  const [infoProfile, setInfoProfile] = useState({})
  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch(
          'http://localhost:3001/api/v1/user/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'tony@stark.com',
              password: 'password123',
            }),
          }
        )
        const receivedToken = await response
          .json()
          .then((res) => res.body.token)
        if (receivedToken) setToken(receivedToken)
      } catch (err) {
        console.log(err)
      }
    }

    async function getInfo(token: string) {
      try {
        const response = await fetch(
          'http://localhost:3001/api/v1/user/profile',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const receivedInfoProfile = await response
          .json()
          .then((res) => res.body)
        console.log(receivedInfoProfile)
        if (receivedInfoProfile) setInfoProfile(receivedInfoProfile)
      } catch (err) {
        console.log(err)
      }
    }
    interface updateInfoProps {
      token: string
      firstName: string
      lastName: string
    }

    async function updateInfo({ token, firstName, lastName }: updateInfoProps) {
      try {
        const response = await fetch(
          'http://localhost:3001/api/v1/user/profile',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName,
              lastName,
            }),
          }
        )
        const newInfoProfile = await response.json().then((res) => res.body)
        if (newInfoProfile) setInfoProfile(newInfoProfile)
      } catch (err) {
        console.log(err)
      }
    }
    // getToken()
    // console.log(token)
    // if (token) getInfo(token)
    // console.log(infoProfile)
    // if (token) updateInfo({ token, firstName: 'Tony', lastName: 'Stark' })
    // console.log(infoProfile)
  }, [])

  return (
    <main>
      <div className="hero">
        <section className="hero-content">
          <h2 className="sr-only">Promoted Content</h2>
          <p className="subtitle">No fees.</p>
          <p className="subtitle">No minimum deposit.</p>
          <p className="subtitle">High interest rates.</p>
          <p className="text">Open a savings account with Argent Bank today!</p>
        </section>
      </div>
      <section className="features">
        <h2 className="sr-only">Features</h2>
        <div className="feature-item">
          <img src={IconChat} alt="Chat Icon" className="feature-icon" />
          <h3 className="feature-item-title">You are our #1 priority</h3>
          <p>
            Need to talk to a representative? You can get in touch through our
            24/7 chat or through a phone call in less than 5 minutes.
          </p>
        </div>
        <div className="feature-item">
          <img src={IconMoney} alt="Chat Icon" className="feature-icon" />
          <h3 className="feature-item-title">
            More savings means higher rates
          </h3>
          <p>
            The more you save with us, the higher your interest rate will be!
          </p>
        </div>
        <div className="feature-item">
          <img src={IconSecurity} alt="Chat Icon" className="feature-icon" />
          <h3 className="feature-item-title">Security you can trust</h3>
          <p>
            We use top of the line encryption to make sure your data and money
            is always safe.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Home

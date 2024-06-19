export async function getToken({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<string | undefined> {
  try {
    const response = await fetch('http://localhost:3001/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const token: string = await response.json().then((res) => res.body.token)
    return token
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export async function getInfo(token: string) {
  try {
    const response = await fetch('http://localhost:3001/api/v1/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const infoProfile = await response.json().then((res) => res.body)
    return infoProfile
  } catch (err) {
    console.log(err)
    return undefined
  }
}

interface updateInfoProps {
  token: string
  firstName: string
  lastName: string
}

export async function updateInfo({
  token,
  firstName,
  lastName,
}: updateInfoProps) {
  try {
    const response = await fetch('http://localhost:3001/api/v1/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
      }),
    })
    const newInfoProfile = await response.json().then((res) => res.body)
    return newInfoProfile
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export async function getToken() {
  try {
    const response = await fetch('http://localhost:3001/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tony@stark.com',
        password: 'password123',
      }),
    })
    const token = await response.json().then((res) => res.body.token)
    return token
  } catch (err) {
    console.log(err)
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
  }
}

interface updateInfoProps{
    firstName:string,
    lastName:string,
}


export async function updateInfo(token: string, {firstName, lastName}:updateInfoProps) {
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
  }
}

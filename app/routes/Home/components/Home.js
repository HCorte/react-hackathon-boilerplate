import React from 'react'

export const Home = ({ me }) => {
  const username = me.get('username')
  if (username) return <h1>Welcome {username}</h1>
  return <h1>Hello stranger</h1>
}

export default Home

import React from 'react'
import { IndexLink, Link } from 'react-router'

export const Home = () =>
  <div>
    <IndexLink to="/" activeClassName="route--active">
      Home
    </IndexLink>
    {' · '}
    <Link to="/counter" activeClassName="route--active">
      Counter
    </Link>
  </div>

export default Home

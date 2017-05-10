import React from 'react'
import { IndexLink, Link } from 'react-router'

export default () =>
  <div>
    <IndexLink to="/" activeClassName="route--active">
      Home
    </IndexLink>
    {' · '}
    <Link to="/counter" activeClassName="route--active">
      Counter
    </Link>
    {' · '}
    <Link to="/login" activeClassName="route--active">
      Log In
    </Link>
    {' · '}
    <Link to="/signup" activeClassName="route--active">
      Sign Up
    </Link>
  </div>

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
  </div>

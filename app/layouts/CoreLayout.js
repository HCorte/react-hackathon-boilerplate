/**
 *
 * CoreLayout
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Header from 'components/Header'

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`

export function CoreLayout(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Hackathon Boilerplate"
        defaultTitle="React.js Hackathon Boilerplate"
        meta={[{
          name: 'description',
          content: 'A React.js Hackathon Boilerplate application',
        }]}
        />
      <Header />
      {React.Children.toArray(props.children)}
    </AppWrapper>
  )
}

CoreLayout.propTypes = {
  children: React.PropTypes.node,
}

export default CoreLayout

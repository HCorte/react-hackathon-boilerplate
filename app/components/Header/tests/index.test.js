import React from 'react'
import { shallow } from 'enzyme'
// import { FormattedMessage } from 'react-intl'

import Header from '../index'

describe('<Header />', () => {
  it('should render links', () => {
    const renderedComponent = shallow(
      <Header />
    )
    expect(renderedComponent.contains('Home')).toEqual(true)

    /*
    expect(renderedComponent.contains(
      <Header {...messages.header} />
    )).toEqual(true)
    */
  })
})

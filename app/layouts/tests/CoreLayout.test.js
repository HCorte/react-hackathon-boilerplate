import React from 'react'
import { shallow } from 'enzyme'

import CoreLayout from '../CoreLayout'

describe('<CoreLayout />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>)
    const renderedComponent = shallow(
      <CoreLayout>
        {children}
      </CoreLayout>
    )
    expect(renderedComponent.contains(children)).toBe(true)
  })
})

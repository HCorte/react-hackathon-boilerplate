/**
 * app combines all the hocs required at the lowest level of the app
 */
import pipe from 'lodash/fp/pipe'
import me from './me'
import cq from './commandAndQuery'

export default pipe(me, cq)

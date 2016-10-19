import counterModuxFactory, { init as initCounter } from './counterModuxFactory'

const root = counterModuxFactory('counter', initCounter(42)) // the counterModux instantiated is our root

export default root

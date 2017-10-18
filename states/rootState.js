import State from './state';
import RegisterState from './registerState'
import DeregisterState from './deregisterState'

export default class RootState extends State {
  constructor(id, username, dataInstance) {
    super();
    this.nextStates = {
      'Register': () => new RegisterState(id, username, dataInstance),
      'Cancel Registration': () => new DeregisterState(id, dataInstance),
      'Check Queue': () => dataInstance.queryQueue(id)
    };
  }

  makeButtons() {
    return Object.keys(this.nextStates)
      .map(commandString => [commandString]);
  }

  process(msg) {
    const selectedOption = Object.keys(this.nextStates).indexOf(msg.text);
    if (selectedOption === -1) {
      return this.render();
    } else if (selectedOption === 2) {
      return (this.nextStates[msg.text])();
    } else {
      return { transition: (this.nextStates[msg.text])() };
    }
  }
}

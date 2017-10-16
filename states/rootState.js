import State from './state';
import RegisterState from './registerState'

export default class RootState extends State {
  constructor(id, dataInstance) {
    super();
    this.dataInstance = dataInstance;
    this.nextStates = {
      'Register': () => new RegisterState(id, dataInstance),
      'Cancel Registation': () => new DeregisterState(id, dataInstance),
      'Check Queue': () => dataInstance.queryQueue()
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
    }

    // A valid option was selected. Transition to next.
    return { transition: (this.nextStates[msg.text])() };
  }
}

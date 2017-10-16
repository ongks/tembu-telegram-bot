import State from './state';

export default class RootState extends State {
  constructor() {
    super();

    // Lazy evaluation of new states.
    this.nextStates = {

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

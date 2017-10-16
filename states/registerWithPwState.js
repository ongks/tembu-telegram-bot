import State from './state';

export default class RegisterWithPwState extends State {
  constructor(id, dataInstance) {
    super();
    this.id = id;
    this.dataInstance = dataInstance;
    this.nextActions = {

    };
  }

  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Please enter your given password.', buttons)
      ]
    };
  }

  makeButtons(){
    const nextCommands = Object.keys(this.nextActions);
    nextCommands.push('Back');
    const mappedButtons = nextCommands.map((commandString) => {
      return [commandString];
    });
    return mappedButtons;
  }

  process(msg) {
    // const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
    return this.dataInstance.addToQueue(this.id, msg.text);
  }
};

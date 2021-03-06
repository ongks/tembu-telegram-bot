import State from './state';
import RegisterWithPwState from './registerWithPwState';

export default class RegisterState extends State {
  constructor(id, username, dataInstance) {
    super();
    this.dataInstance = dataInstance;
    this.nextActions = {
      'Yes': () => dataInstance.addToQueue(id, username, ''),
      'No': () => new RegisterWithPwState(id, username, dataInstance)
    };
  }

  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Are you the first member of your pair? If yes, you will be issued a password for your partner to key in. If no, we will prompt you to enter the password.', buttons)
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
    const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
    if (selectedOption === -1) {
      return this.render();
    } else if (selectedOption === 0) {
      return (this.nextActions[msg.text])();
    } else {
      return { transition: (this.nextActions[msg.text])() };
    }
  }
};

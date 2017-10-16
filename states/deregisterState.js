import State from './state';

export default class DeregisterState extends State {
  constructor(id, dataInstance) {
    super();
    this.dataInstance = dataInstance;
    this.nextActions = {
      'Yes': () => dataInstance.deleteFromQueue(id)
    };
  }

  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Are you sure? This action is irreversible.', buttons)
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
    }
    return (this.nextActions[msg.text])();
  }
};

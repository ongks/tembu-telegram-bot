export default class InterestGroupState {
  constructor() {
    this.nextActions = {
      'IG Creation Form': [],
      'IG Calendar': [],
      'IG List': []
    };
  }

  render() {
    const nextCommands = Object.keys(this.nextActions);
    nextCommands.push('Back');
    const mappedButtons = nextCommands.map((commandString) => {
      return [commandString];
    });
    return {
      respond: true,
      messages: [
        {
          text: 'Choose an option.',
          options: {
            reply_markup: {
              keyboard: mappedButtons,
              one_time_keyboard: true
            }
          }
        }
      ]
    };
  }

  process(msg) {
    const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
    if (selectedOption === -1) return this.render();
    return (this.nextActions[msg.text])();
  }
};

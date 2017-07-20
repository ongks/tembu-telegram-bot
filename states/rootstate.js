export default class RootState {
  constructor() {
    // The order of these commands matter! Keep them aligned with the set of next states too.
    this.nextCommands = ['Interest Groups','Dining Hall','Supper','CSC matters','Residential Life','General Feedback'];
  }

  process(msg) {
    if (this.nextCommands.indexOf(msg.text) === -1) {
      const mappedButtons = this.nextCommands.map((commandString) => {
        return [commandString];
      });
      return { respond: true, text: 'Choose an option.', options: {reply_markup: {keyboard:mappedButtons, one_time_keyboard:true}}};
    }

    // A valid option was selected. Transition to next.
    return {respond: true, text: 'Error: Work in progress.'};
  }

}

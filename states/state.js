export default class State {
  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Choose an option.', buttons)
      ]
    };
  }
  
  makeButtons() {
    throw 'Unimplemented error: State.makeButtons().';
  }

  static makeButtonMessage(text, buttons) {
    return {
      text: text,
      options: {
        reply_markup: {
          keyboard: buttons,
          one_time_keyboard: true
        }
      }
    };
  }
}

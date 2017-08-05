export default class State {
  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Choose an option.', buttons),
      ],
    };
  }

  makeButtons() {
    // This method will only be called when the object that inherits this class
    // does not implement the method. Hence throwing error here.
    throw new Error('Unimplemented: makeButtons() method.');
  }

  static makeButtonMessage(text, buttons) {
    return {
      type: 'text',
      text,
      options: {
        reply_markup: {
          keyboard: buttons,
          one_time_keyboard: true,
        },
      },
    };
  }
}

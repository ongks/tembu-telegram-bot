import RootState from './states/rootState';


export default class StateManager {
  constructor(id) {
    // Only tracks these two params for now, but as the bot's complexity increases
    // it will need to track more variables.
    this.id = id;
    this.state = [];
  }

  process(msg) {
    // Regardless of state, if typed start, jump back to root.
    if (msg.text === '/start' || this.state.length === 0) {
      this.state = [new RootState()];
      return this.addIDParam(this.state[0].render());
    }

    // Catch the 'Back' message and pop the state.
    if (msg.text === 'Back' && this.state.length > 1) {
      this.state = this.state.splice(1);
      return this.addIDParam(this.state[0].render());
    }

    const processedData = this.state[0].process(msg);

    if (processedData.transition) {
      this.state.unshift(processedData.transition);
      return this.addIDParam(this.state[0].render());
    }
    
    if (processedData.respond) {
      return this.addIDParam(processedData);
    }
    return { respond: false };
  }

  /*
    This method is always called before returning messages back to the caller,
    because it needs to know which chatID to send the message back to (in this case,
    most likely the user who invoked the commands).
  */
  addIDParam(data) {
    data.chatID = this.id;
    return data;
  }
};

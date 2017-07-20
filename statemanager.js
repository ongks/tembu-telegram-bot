import RootState from './states/rootstate';


export default class StateManager {
  constructor(id) {
    this.id = id;
    this.state = [];
  }

  process(msg) {
    // Regardless of state, if typed start, jump back to root.
    if (msg.text === '/start' || this.state.length === 0) {
      this.state = [new RootState()];
    }

    const processedData = this.state[0].process(msg);

    // In the future, check for request for new state here too.
    
    if (processedData.respond) {
      processedData.chatID = this.id;
      return processedData;
    }
    return { respond: false };
  }
};

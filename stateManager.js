import RootState from './states/rootState';
import AdminRootState from './states/adminRootState';

export default class StateManager {
  constructor(id, dataInstance) {
    this.adminIdList = [143885245];
    this.id = id;
    this.dataInstance = dataInstance;
    this.state = [];
  }

  process(msg) {
    // Regardless of state, if typed start, jump back to root.
    if (msg.text === '/start' || this.state.length === 0) {
      if (this.adminIdList.includes(this.id)) {
        this.state = [new AdminRootState(this.id, this.dataInstance)];
      } else {
        this.state = [new RootState(this.id, this.dataInstance)];
      }
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

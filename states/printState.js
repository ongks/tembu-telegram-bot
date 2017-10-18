import State from './state';

export default class PrintState extends State {
  constructor(dataInstance) {
    super();
    this.dataInstance = dataInstance;
  }

  render() {
    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: 'How many pairs do you want to view?'
        }
      ]
    };
  }

  process(msg) {
    return this.dataInstance.printQueue(parseInt(msg.text));
  }
}

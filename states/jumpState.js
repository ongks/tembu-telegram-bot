import State from './state';

export default class JumpState extends State {
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
          text: 'Which pair are you moving to the front?'
        }
      ]
    };
  }

  process(msg) {
    return this.dataInstance.jumpQueue(parseInt(msg.text));
  }
}

import State from './state';

export default class RegisterWithPwState extends State {
  constructor(id, dataInstance) {
    super();
    this.id = id;
    this.dataInstance = dataInstance;
  }

  render() {
    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: 'Please enter your given password.'
        }
      ]
    };
  }

  process(msg) {
    // const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
    return this.dataInstance.addToQueue(this.id, msg.text);
  }
};

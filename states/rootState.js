import InterestGroupState from './interestGroup/interestGroupState';
import DiningHallState from './diningHall/diningHallState';
import SupperState from './supper/supperState';
import CscState from './csc/cscState';
import ResidentialLifeState from './residentialLife/residentialLifeState';
import GeneralFeedbackState from './generalFeedback/generalFeedbackState';

export default class RootState {
  constructor() {
    // Using the double aligned lists method to enforce a fixed order of the options.
    this.nextCommands = ['Interest Groups','Dining Hall','Supper','CSC matters','Residential Life','General Feedback'];
    this.nextStates = {
      'Interest Groups': new InterestGroupState(),
      'Dining Hall': new DiningHallState(),
      'Supper': new SupperState(),
      'CSC matters': new CscState(),
      'Residential Life': new ResidentialLifeState(),
      'General Feedback': new GeneralFeedbackState()
    };
  }

  render() {
    const mappedButtons = Object.keys(this.nextStates).map((commandString) => {
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
    const selectedOption = Object.keys(this.nextStates).indexOf(msg.text);
    if (selectedOption === -1) {
      return this.render();
    }
    
    // A valid option was selected. Transition to next.
    return { transition: this.nextStates[msg.text] };
  }

}

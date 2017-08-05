import State from './state';
import InterestGroupState from './interestGroup/interestGroupState';
import DiningHallState from './diningHall/diningHallState';
import SupperState from './supper/supperState';
import CscState from './csc/cscState';
import ResidentialLifeState from './residentialLife/residentialLifeState';
import GeneralFeedbackState from './generalFeedback/generalFeedbackState';

export default class RootState extends State {
  constructor() {
    super();
    this.nextStates = {
      'Interest Groups': new InterestGroupState(),
      'Dining Hall': new DiningHallState(),
      Supper: new SupperState(),
      'CSC matters': new CscState(),
      'Residential Life': new ResidentialLifeState(),
      'General Feedback': new GeneralFeedbackState(),
    };
  }

  makeButtons() {
    const mappedButtons = Object.keys(this.nextStates)
      .map(commandString => [commandString]);
    return mappedButtons;
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

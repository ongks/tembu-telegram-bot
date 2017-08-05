import State from '../state';
import { formIDs } from '../../config';

export default class CscState extends State {
  constructor() {
    super();
    this.nextActions = {
      'Request For Payment form': this.sendRfpForm.bind(this),
      'Budget Request Form': this.sendBudgetRequestForm.bind(this),
      'Equipment Booking Form': this.sendEquipmentBookingForm.bind(this),
      'Booking of Venues': this.bookingOfVenues.bind(this),
      'About the CSC': this.aboutCsc.bind(this),
    };
  }

  makeButtons() {
    const nextCommands = Object.keys(this.nextActions);
    nextCommands.push('Back');
    return nextCommands
      .map(commandString => [commandString]);
  }

  process(msg) {
    const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
    if (selectedOption === -1) return this.render();
    return (this.nextActions[msg.text])();
  }

  sendRfpForm() {
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Here is the RFP form.', this.makeButtons()),
        {
          type: 'document',
          document: formIDs.rfp_form,
        },
      ],
    };
  }

  sendBudgetRequestForm() {
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Unimplemented.', this.makeButtons()),
      ],
    };
  }

  sendEquipmentBookingForm() {
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Here is the Equipment Booking form.', this.makeButtons()),
        {
          type: 'document',
          document: formIDs.equipment_booking_form,
        },
      ],
    };
  }

  bookingOfVenues() {
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Unimplemented.', this.makeButtons()),
      ],
    };
  }

  aboutCsc() {
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Unimplemented.', this.makeButtons()),
      ],
    };
  }
}

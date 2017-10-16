/**
 * JSON Data structure:
 * {Queue counter: 20,
 * Password dict:{key: TELEGRAM_UID, value: array with PASS as well as position in queue}.
 * Entry status dict: {key: PASS, value: (hasBeenUsed :: 0, 1})
 * }
 */
export default class Data {
  constructor() {
    this.jsonfile = require('jsonfile');
    this.filepath = './data.json';

    this.jsonfile.readFile(this.filepath, (err, data) => {
      if (err) throw err;
      // let jsonData = JSON.parse(data);
      console.log(data);
      this.queueCounter = data['Queue counter'];
      this.passwordDict = data['Password dict'];
      this.entryStatusDict = data['Entry status dict'];
    });
  }

  /**
   * Adds a new entry in the idPwDict
   * @param id unique telegram id
   * @param pw if registering as 2nd person, otherwise empty string for 1st person
   * @return pw
   */
  addToQueue(id, pw) {
    if (this.passwordDict.hasOwnProperty(id.toString())) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'You have already registered.'
          }
        ]
      };
    }

    // randomly generate an 8-digit pw for pairing if pw is an empty string
    if (!pw) {
      const crypto = require('crypto');

      function randomValueHex (len) {
        return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
      }

      pw = randomValueHex(8);
    }

    this.passwordDict[id.toString()] = pw;

    let data = {
      'Queue counter': this.queueCounter,
      'Password dict': this.passwordDict,
      'Entry status dict': this.entryStatusDict
    };

    // let jsonData = JSON.stringify(data, null, 2);
    this.jsonfile.writeFile(this.filepath, data, {spaces: 2}, (err) => {
      if (err) throw err;
      console.log('Data updated.');
    });

    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: 'Successfully registered.'
        }
      ]
    };
  }

  /**
   * Deletes given id, and checks for other id with same pw, then delete that id as well.
   * TODO: NEED WAY TO UPDATE COUNTER
   * @param id
   */
  deleteFromQueue (id) {

  }

  /**
   * check array's position in queue, then subtract current counter to give current position in queue, multiply by 5 to give approx ETA
   * @param id
   */
  queryQueue (id) {

  }

}
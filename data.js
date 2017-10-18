/**
 * JSON Data structure:
 * {Queue: [Pass1, Pass2, ...],
 * ID to Password:{key: TELEGRAM_UID, value: Password}.
 * Password to ID: {key: PASS, value: [boolean for entered, ID 1, ID 2])
 * }
 */
export default class Data {
  constructor() {
    this.jsonfile = require('jsonfile');
    this.filepath = './data.json';

    this.currentJob = new Promise((resolve, reject) => {
      this.jsonfile.readFile(this.filepath, (err, data) => {
        if (err) throw err;
        // let jsonData = JSON.parse(data);
        // console.log(data);
        this.queue = data['Queue'];
        this.idToPassword = data['ID to Password'];
        this.passwordToId = data['Password to ID'];
        this.idToUsername = data['ID to Username'];
      });
      resolve();
    });
  }

  /**
   * Adds a new entry in the queue, idToPassword and passwordToDict tables.
   * @param id unique telegram id
   * @param pw if registering as 2nd person, otherwise empty string for 1st person
   */
  addToQueue(id, username, pw) {
    if (this.idToPassword.hasOwnProperty(id.toString())) {
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

    if (pw.length > 0 && !this.passwordToId.hasOwnProperty(pw)) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'Invalid password.'
          }
        ]
      };
    }

    if (pw.length > 0 && this.passwordToId[pw].length === 3) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'A pair has already registered with this password.'
          }
        ]
      };
    }

    if (pw.length > 0 && this.passwordToId[pw][0] === 1) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'You have already entered. Please give others a chance.'
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

    // edit queue and tables
    this.queue.unshift(pw);
    this.idToPassword[id] = pw;
    this.idToUsername[id] = username;

    if (!this.passwordToId.hasOwnProperty(pw)) {
      this.passwordToId[pw] = [0, id];
    } else {
      this.passwordToId[pw].push(id);
    }


    // write back to data.json file
    let data = {
      "Queue": this.queue,
      "ID to Password": this.idToPassword,
      "Password to ID": this.passwordToId,
      "ID to Username": this.idToUsername
    };

    this.currentJob.then(() => {
      this.jsonfile.writeFile(this.filepath, data, {spaces: 2}, (err) => {
        if (err) throw err;
        console.log('Data updated.');
      });
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
   * Deletes associated pw from queue.
   * Deletes given id, and checks for other id with same pw, then delete that id as well from idToPassword table.
   * Deletes associated array from passwordToId table.
   * @param id
   */
  deleteFromQueue(id) {
    const pw = this.idToPassword[id];
    const idx = this.queue.indexOf(pw);

    if (idx === -1) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'You are not in the queue.'
          }
        ]
      };
    }
    this.queue.splice(idx, 1);

    const memberOneId = this.passwordToId[pw][1];
    delete this.idToPassword[memberOneId];
    delete this.idToUsername[memberOneId];
    if (this.passwordToId[pw].length === 3) {
      const memberTwoId = this.passwordToId[pw][2];
      delete this.idToPassword[memberTwoId];
      delete this.idToUsername[memberTwoId];
    }
    delete this.passwordToId[pw];

    // write back to data.json file
    let data = {
      "Queue": this.queue,
      "ID to Password": this.idToPassword,
      "Password to ID": this.passwordToId,
      "ID to Username": this.idToUsername
    };

    this.currentJob.then(() => {
      this.jsonfile.writeFile(this.filepath, data, {spaces: 2}, (err) => {
        if (err) throw err;
        console.log('Data updated.');
      });
    });

    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: 'You and your partner are no longer in the queue.'
        }
      ]
    };
  }

  /**
   * Check position of pw from the back (backmost is 1st), then multiply by 5 to give approx ETA
   * @param id
   */
  queryQueue(id) {
    const pw = this.idToPassword[id];
    const idx = this.queue.length - this.queue.indexOf(pw);
    const msg = 'Your queue position is ' + idx + '. Your turn will be in approximately ' + idx * 5 + ' mins.';

    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: msg
        }
      ]
    };
  }

  /**
   * Admin function for checking next few pairs in the queue, also to confirm identities
   * @param numberToDisplay
   */
  printQueue(numberToDisplay) {
    if (!Number.isInteger(numberToDisplay)) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'Please enter a valid integer!'
          }
        ]
      };
    }

    if (numberToDisplay > this.queue.length) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'There aren\'t that many pairs in the queue!'
          }
        ]
      };
    }

    const arr = this.queue.slice(this.queue.length - numberToDisplay);
    let msg = 'Current queue:\n';
    let position = 0;
    while (arr.length > 0) {
      position += 1;
      let currPw = arr.pop();
      let id1 = this.passwordToId[currPw][1];
      let user1 = this.idToUsername[id1];
      let id2 = this.passwordToId[currPw][2];
      let user2 = this.idToUsername[id2];
      if (user2) {
        msg += position + '. ' + user1 + ' & ' + user2 + '\n';
      } else {
        msg += position + '. ' + user1 + '\n';
      }
    }

    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: msg
        }
      ]
    };
  }

  /**
   * Admin function: Advances queue forward by 1 position, marks array[0] as 1 in pwToId table
   */
  popQueue() {
    if (this.queue.length === 0) {
      return {
        respond: true,
        messages: [
          {
            type: 'text',
            text: 'Queue is empty!'
          }
        ]
      };
    }

    const pw = this.queue.pop();
    this.passwordToId[pw][0] = 1;

    // write back to data.json file
    let data = {
      "Queue": this.queue,
      "ID to Password": this.idToPassword,
      "Password to ID": this.passwordToId,
      "ID to Username": this.idToUsername
    };

    this.currentJob.then(() => {
      this.jsonfile.writeFile(this.filepath, data, {spaces: 2}, (err) => {
        if (err) throw err;
        console.log('Data updated.');
      });
    });

    return {
      respond: true,
      messages: [
        {
          type: 'text',
          text: 'Confirmed entrance for current group.'
        }
      ]
    };
  }

  /**
   * Admin function to move the position-th pair forward, in case when current first pair is not here yet
   * @param position of the pair to be brought forward
   */
  jumpQueue(position) {

  }

}
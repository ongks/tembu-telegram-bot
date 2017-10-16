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
      });
      resolve();
    });
  }

  /**
   * Adds a new entry in the queue, idToPassword and passwordToDict tables.
   * @param id unique telegram id
   * @param pw if registering as 2nd person, otherwise empty string for 1st person
   */
  addToQueue(id, pw) {
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

    if (!this.passwordToId.hasOwnProperty(pw)) {
      this.passwordToId[pw] = [0, id];
    } else {
      this.passwordToId[pw].push(id);
    }

    // write back to data.json file
    let data = {
      "Queue": this.queue,
      "ID to Password": this.idToPassword,
      "Password to ID": this.passwordToId
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
    this.queue.splice(idx, 1);

    const memberOneId = this.passwordToId[pw][1];
    delete this.idToPassword[memberOneId];
    if (this.passwordToId[pw].length === 3) {
      const memberTwoId = this.passwordToId[pw][2];
      delete this.idToPassword[memberTwoId];
    }
    delete this.passwordToId[pw];

    // write back to data.json file
    let data = {
      "Queue": this.queue,
      "ID to Password": this.idToPassword,
      "Password to ID": this.passwordToId
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
    const msg = 'Your queue position is ' + idx + '. Your turn will be in approximately ' + idx * 5 + 'mins.';

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

}
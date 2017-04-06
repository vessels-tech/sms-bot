
const interactionTypes = [
  'message', //An sms message from a user
  'reply'    //A reply from the AI API
];

class Interaction {
  constructor(data, type) {
    if (interactionTypes.indexOf(type) == -1) {
      throw new Error(`Interaction type: ${type} not supported.`);
    }

    this.data = data;
    this.type = type;
  }
}

module.exports = Interaction;

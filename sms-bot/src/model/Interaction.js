const InteractionTypes = require(__base + '/utils/enums').InteractionTypes;

class Interaction {
  constructor(data, type) {

    if (Object.keys(InteractionTypes).map(key => InteractionTypes[key]).indexOf(type) == -1) {
      throw new Error(`Interaction type: ${type} not supported.`);
    }

    this.data = data;
    this.type = type;
  }
}

module.exports = Interaction;

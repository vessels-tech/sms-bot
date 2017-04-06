
class Thread {
  constructor() {
    this.interactions = []; //Ordered list of interactions between the user and api. Latest interactions are at the end!
    this.metadata = {};     //Some metadata or something
  }

  addInteraction(data, type) {
    this.interactions.push(new Interaction(data, type));
  }

}

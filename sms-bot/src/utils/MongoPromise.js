

/**
  options: {
    collection: name of the connection
    query: the query
  }

 */

class MongoPromise {
  constructor(db) {
    this.db = db; //The underlying mongo object
  }

  /**
   * Find documents in a collection
   * @param collectionName - name of the collection
   * @param options:
            options.query - query options. see Mongodb docs for query options
   * @returns Promise<array<document>>
   */
  find(collectionName, options) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName);
      if (!options.query) {
        options.query = {};
      }
      collection.find(options.query).toArray((err, docs) => {
        return err ? reject(err) : resolve(docs);
      });
    });
  }

  /**
   * Find first document in a collection
   * @param collectionName - name of the collection
   * @param options:
            options.query - query options. see Mongodb docs for query options
   * @returns Promise<document>
   */
  findOne(collectionName, options) {
    return this.find(collectionName, options)
      .then(_docs => {
        return _docs[0];
      });
  }

}


module.exports = MongoPromise;

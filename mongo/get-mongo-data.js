

module.exports = async (_collection, _query) => {
  const MongoClient = require("mongodb").MongoClient;
  const dotenv = require('dotenv');
  dotenv.config();

  const URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.MONGODB_DB_NAME;

  let _data = null;

  try {
    const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const dataBase = await client.db(DB_NAME);
    _data = await dataBase.collection(_collection).find(_query).toArray();
    await client.close();
  } catch (error) {
    console.log("mongo-error : ", error);
    _data = "mongo-error : " + error;
  }
  finally {
    return _data
  }
};

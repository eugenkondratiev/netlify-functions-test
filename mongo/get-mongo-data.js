

module.exports = async (_collection, _query = {}, _options) => {
  const MongoClient = require("mongodb").MongoClient;
  const dotenv = require('dotenv');
  dotenv.config();

  const URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.MONGODB_DB_NAME;
  console.log("#### options = ", _options);
  console.log("#### _query = ", _query);

  const { limit = false, count = false, start = false } = _options || {};

  let _data = null;

  try {
    const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const dataBase = await client.db(DB_NAME);
    console.log("count = ", count, " , limit = ", limit, "    start  = ", start);

    if (count) {

      _data = await dataBase.collection(_collection).countDocuments();
    } else if (limit) {
      if (start) {
        _data = await dataBase.collection(_collection).find(_query).skip(+start).limit(+limit).toArray();
      } else {
        _data = await dataBase.collection(_collection).find(_query).limit(+limit).toArray();
      }

    } else {
      _data = await dataBase.collection(_collection).find(_query).toArray();

    }
    await client.close();
  } catch (error) {
    _data = "mongo-error : " + error;
  }
  finally {
    return _data
  }
};

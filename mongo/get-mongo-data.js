

module.exports = async (_collection, _query = {}, _options, _projection = {}) => {
  const MongoClient = require("mongodb").MongoClient;
  const dotenv = require('dotenv');
  dotenv.config();

  const URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.MONGODB_DB_NAME;
  // console.log("#### options = ", _options);
  // console.log("#### _query = ", _query);

  const { limit = false, count = false, start = false } = _options || {};

  let _data = null;
  let _count = null;
  let _err = null;
  try {
    const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    // const dataBase = await client.db(DB_NAME);
    // console.log("count = ", count, " , limit = ", limit, "    start  = ", start);
    const _allbase = await client.db(DB_NAME).collection(_collection);
    _count = await _allbase.find(_query).count();

    if (count) {

      _data = await _allbase.countDocuments();
    } else if (limit) {
      if (start) {
        _data = await _allbase.find(_query).project(_projection).skip(+start).limit(+limit).toArray();
      } else {
        _data = await _allbase.find(_query).project(_projection).limit(+limit).toArray();
      }

    } else {
      _data = await _allbase.find(_query).project(_projection).toArray();

    }
    await client.close();
  } catch (error) {
    _err = "mongo-error : " + error;
  }
  finally {
    return { count: _count, data: _data, error: _err }
  }
};

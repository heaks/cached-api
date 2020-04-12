const Keys = require('../models/keys');
const randomStringGenerator = require('../utils/stringGenerator');
const generateDatePlusTTL = require('../utils/generateTTL');

const defaultLimit = 10;
const cacheLimit = process.env.LIMIT || defaultLimit;

const removeOldestEntries = async () => {
  const [latest] = await Keys.find().sort({ updatedAt: 1 }).limit(1);
  await Keys.findOneAndDelete({ _id: latest._id });
};

const checkKeyMiddleware = (req, res, next) => {
  const { key } = req.query;
  if (!key) {
    res.status(400).send('Key is required');
  } else {
    next();
  }
};

const checkNameMiddleware = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('New name is required');
  } else {
    next();
  }
};

const keyUpdateMiddleware = async (req, res) => {
  try {
    const { key } = req.query;
    const query = { name: key };
    const { name } = req.body;

    const modifier = {
      $set: {
        value: name,
        updatedAt: new Date(),
        expiresAt: generateDatePlusTTL()
      }
    };

    const data = await Keys.findOne(query);
    if (!data) {
      res.status(404).send(`Key wasn't found`);
    }

    await Keys.updateOne(query, modifier);
    res.send(`Key ${key} was successfully updated`);
  } catch (e) {
    res.status(500).json({ message: err.message });
  }
};

const keyDeleteMiddleware = async (req, res) => {
  try {
    const { key } = req.query;
    const query = { name: key };

    const data = await Keys.findOne(query);
    if (!data) {
      res.status(404).send(`Key wasn't found`);
    }

    await Keys.deleteOne(query);
    res.send(`Key ${key} was successfully deleted`);
  } catch (e) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAllKeysMiddleware = async (req, res) => {
  try {
    await Keys.deleteMany({});
    res.send('All keys were deleted');
  } catch (e) {
    res.status(500).json({ message: err.message });
  }
};

const getAllKeysMiddleware = async (req, res) => {
  try {
    const keys = await Keys.find();
    res.send(keys)
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getByKeyMiddleware = async (req, res) => {
  try {
    const { key } = req.query;
    const query = { name: key };
    const data = await Keys.findOne(query);
    if (!data) {
      console.log('Cache miss');
      const count = await Keys.find().count();
      if ( count >=  cacheLimit) {
        removeOldestEntries();
      }

      const randomString = randomStringGenerator(20);
      const query = {
        name: key,
        value: randomString,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: generateDatePlusTTL(),
      };
      Keys.create(query);
      res.send(randomString);
    } else {
      console.log('Cache hit');
      let result = data.value;
      const modifier = {
        $set: {
          expiresAt: generateDatePlusTTL(),
        }
      };
      if (data.expiresAt < new Date()) {
        const newString = randomStringGenerator(20);
        result = newString;
        modifier['$set'].value = newString;
      }
      await Keys.updateOne(query, modifier);
      res.send(result);
    }
  } catch (e) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  checkKeyMiddleware,
  checkNameMiddleware,
  keyUpdateMiddleware,
  keyDeleteMiddleware,
  deleteAllKeysMiddleware,
  getAllKeysMiddleware,
  getByKeyMiddleware
};
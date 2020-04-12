const router = require('express').Router();

const {
  checkKeyMiddleware,
  checkNameMiddleware,
  keyUpdateMiddleware,
  keyDeleteMiddleware,
  deleteAllKeysMiddleware,
  getAllKeysMiddleware,
  getByKeyMiddleware,
} = require('./middlewares');

router.get('/all', getAllKeysMiddleware);
router.get('/', checkKeyMiddleware, getByKeyMiddleware);
router.put('/', checkKeyMiddleware, checkNameMiddleware, keyUpdateMiddleware);
router.delete('/all', deleteAllKeysMiddleware);
router.delete('/', checkKeyMiddleware, keyDeleteMiddleware);

module.exports = router;
const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getLists, createList, addProductToList, shareList } = require('../controllers/listController');

const router = express.Router();

router.get('/', authenticate, getLists);
router.post('/', authenticate, createList);
router.post('/add-product', authenticate, addProductToList);
router.post('/share', authenticate, shareList);

module.exports = router;

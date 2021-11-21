const express = require('express')
const ToughtsController = require('../controllers/ToughtsController')

const checkAuth = require('../helpers/auth').checkAuth

const router = express.Router()

router.post('/addtought', checkAuth,  ToughtsController.createToughtPost)
router.get('/addtought', checkAuth,  ToughtsController.createTought)
router.get('/dashboard', checkAuth,  ToughtsController.dashboard)
router.get('/', ToughtsController.showToughts)


module.exports = router
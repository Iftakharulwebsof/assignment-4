const express=require('express')
const router=express.Router()

const userControllers=require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.route('/register').post(userControllers.register)
router.route('/login').post(userControllers.loginUser)
router.route('/allUser').get(authMiddleware,userControllers.getAllUser)
router.route('/currentUser/:id').get(authMiddleware,userControllers.getOne)
router.route('/profileUpdate/:id').patch(authMiddleware,userControllers.UpdateProfile)
router.route('/deletAccount/:id').delete(authMiddleware,userControllers.deleteSingleUser)

module.exports=router;
const express = require("express")
const router = express.Router()
const cors = require('cors')
const connection = require('../models/db')
const {test,loginUser,getProfile,registerUser,verifyMail, createCampaign,PasswordReset,NewPassword, stripeIntegration,logsout,fetchFundraise,filterCards,donatePage} = require('../controllers/authControllers')
const {hashPassword,comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const nodemailer=require('nodemailer')
const Stripe = require('stripe')
const stripe = Stripe('sk_test_51OT909JvFBCqm5cO3mOWVLKvR5cdT6eDnK05rYu0tGuuwfNa6xRHNsa0Mfny4NQPSe2Z0S57SXIqrNISCl7oDJ5M00b178UuU5')
//middleware
router.use(
    cors({
        credentials:true,
        origin:'http://localhost:5173'
    })
)
// route to actual route we want
router.get('/',test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile',getProfile,(req,res)=>{
    return res.json({Status:"Success",name: req.name,
    id: req.id})
})
router.get('/verify/:id/:expirationTimestamp', verifyMail)
router.get('/logout',logsout)
router.post('/ResetPassword', PasswordReset)
router.post('/ForgotPassword/:id/:token', NewPassword)
router.post('/fundraiser', createCampaign)
router.get('/fundraise/:isActive', fetchFundraise)
router.post('/create-checkout-session', stripeIntegration)
router.get('/filterCards/:type',filterCards)
module.exports = router
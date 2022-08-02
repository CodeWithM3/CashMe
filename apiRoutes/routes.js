const express = require('express')
const bcrypt = require('bcrypt')
require('dotenv').config()
const Registration = require('../database/registrationSchema.js')
const accountDeposit = require('../database/accountDeposit.js')
const {TransferMoney} = require('../queues/sendingMoneyqueue')
const router = express.Router()



router.post('/cashme/registration_portal', async(req, res)=>{
try {
    const {Fullname, Phone, Country, Bank, AccountType, Password} = req.body
    const oldUser = await Registration.findOne({Fullname})
    const hashedPassword = await bcrypt.hash(Password, 10)
    const User = new Registration({
        Fullname: Fullname,
        Phone: Phone,
        Password: hashedPassword,
        Country: Country,
        Bank: Bank,
        AccountType: AccountType

    })
    if(!Fullname || !Phone || !Password || !Country || !Bank || !AccountType) return res.status(400).send({message: `Please enter all fields`})
    if (oldUser) return res.status(404).send({message: 'User Already Exists. please change your username'})
    if(Password.length < 8) return res.status(400).send({message: `Password should be atleast 8 characters `})
    
    await User.save()
    res.status(200).send({message: `Registration was successful, welcome ${User.Fullname} to cashMe, this is your ID ${User.ClientID} please keep it safe`, success: true})
}   catch (error) {
    console.log('An error occurred with registration portal', error.message)
}
})

router.post('/cashme/login', async(req, res)=>{
try {
    const {Fullname, Password} = req.body
    const User = await Registration.findOne({Fullname})
    if (!User) return res.status(400).send({message: `Cannot find User`})
    if (!await bcrypt.compare(Password, User.Password)) return res.status(400).send({message: `Password Incorrect`})
    return res.status(200).send({message: `User has logged into CashMe successfully`,success: true})
     
} catch (error) {
    console.log(error.message)
}
})


router.get('/cashme/checkCharges/transaction', async(req, res)=>{
    try {

    const acctDep = new accountDeposit()
    const Amount = req.body.Amount
    const Charges = await acctDep.CashmeMaintainanceFee(Amount)
    return res.status(200).send({message: `the charges for ${Amount} is ${Charges} USD`})
   
    } catch (error) {
        console.log(error)
        
    }
})


// For Admin
router.get('/cashme/getUsersbyBank', async(req, res)=>{
    try {
        const Bank = req.body.Bank
        const findUserBybank = await Registration.findByBank(Bank)
        return res.status(201).send({data: findUserBybank})
    
    } catch (error) {
        console.log(error)
        
    }
}) 


router.post('/cashme/transfer', async(req, res)=>{
    
     try {
      const {AccountBank, MerchantID, Amount, Narration, Currency, Reference , DebitCurrency} = req.body
      const DepositMoneyToAccount = new accountDeposit({
          AccountBank: AccountBank,
          MerchantID: MerchantID,
          Amount: Amount,
          Narration: Narration,
          Currency: Currency,
          Reference: Reference +' '+Date.now(),
          DebitCurrency: DebitCurrency
      })
       const data =  await DepositMoneyToAccount.save()
       console.log(data.Amount)
        await TransferMoney(data)
         return res.status(201).send({message:'Transfer is successful, please wait for your receipt'})
     } catch (error) {
         console.log(error)
     }

})

module.exports = router
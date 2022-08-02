const mongoose = require('mongoose')
const Schema = mongoose.Schema
const deposit = new Schema({
    AccountBank: {
        type: String,
        required: true,
        lowercase: true,
        
       
    },  
    MerchantID:{
        type: Number,
        required: true,
       

    },
    Amount:{
        type: Number,
        required: true
    },
    Narration:{
        type: String,
        required: true,
        lowercase: true
    
    },
    Currency:{
        type: String,
        required: true
    },
    Reference:{
        type: String,
        required: true,
      
    },
    DebitCurrency:{
        type: String,
        required: true
    }

})


deposit.methods.CashmeMaintainanceFee = function(Amount) {
   const charge = Math.floor(Amount * 0.5/100)
    return charge
  };

  module.exports = Account = mongoose.model('Deposit', deposit)



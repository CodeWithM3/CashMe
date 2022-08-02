const mongoose = require('mongoose')
const uuid = require('node-uuid')
const Schema = mongoose.Schema
const user = new Schema({
    Fullname: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    Phone:{
        type: Number,
        required: true,
        unique: true

    },
    Password:{
        type: String,
        required: true,
       
    },
    Country:{
        type: String,
        required: true
    },
    Bank:{
        type: String,
        required: true,
        lowercase: true
    },
    AccountType:{
        type: String,
        required: true
    },
    ClientID:{
        type: Object,
        default: uuid.v1,
        unique: true
    },
    Date:{
        type: Date,
        default: Date.now()
    }

})
user.statics.findByBank = function(Bank) {
    return this.find({ Bank: new RegExp(Bank) });
  };

  module.exports = Registration = mongoose.model('User', user)



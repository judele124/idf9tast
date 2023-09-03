const mongoose = require("mongoose");
const Joi = require("joi");


const gameSchema = new mongoose.Schema({
  title:String,
  info:String,
  price:Number,
  year:Number,
  img_url:String,
  category:{
    type:String, default:"General"
  },
  user_id:String
},{timestamps:true})

exports.GameModel = mongoose.model("games",gameSchema);


exports.validateGame = (_reqbody) => {
    const joiSchema = Joi.object({
      title: Joi.string().min(2).max(100).required(),
      info:Joi.string().min(2).max(400).required(),
      price:Joi.number().min(1).max(99999).required(),
      year:Joi.number().min(1972).max(2030).required(),
      img_url:Joi.string().min(2).max(400).allow(null,"")
    })
    return joiSchema.validate(_reqbody)
  }

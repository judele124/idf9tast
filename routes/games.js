const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateGame , GameModel } = require("../models/gameModel");

const router = express.Router();

router.get("/", async(req,res) => {
  try{
    const limit = req.query.limit || 5;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filteFind = {};
    // בודק אם הגיע קווארי לחיפוש ?s=
    if(req.query.s){  
      const searchExp = new RegExp(req.query.s,"i");
      filteFind = {$or:[{title:searchExp},{info:searchExp}]}
    }
    const data = await GameModel
    .find(filteFind)
    .limit(limit)
    .skip(page * limit)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/count" , async(req ,res) => {
  try{
    const limit = req.query.limit || 5;
    const count = await GameModel.countDocuments({});

    res.json({count , pages:Math.ceil(count/ limit)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.post("/", auth , async(req , res) => {
    const validBody = validateGame(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const game = new GameModel(req.body);
      game.user_id = req.tokenData._id;
      await game.save();
      res.status(201).json(game);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
})


router.put("/:id" , auth , async(req ,res) => {
  const validBody = validateGame(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id;
    const data = await GameModel.updateOne({_id:id , user_id:req.tokenData._id} , req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


router.delete("/:id" , auth , async(req ,res) => {
  try{
    const id = req.params.id;
    const data = await GameModel.deleteOne({_id:id , user_id:req.tokenData._id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;
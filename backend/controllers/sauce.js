  
// Contient la logique métier concernant les sauces, à appliquer aux différentes routes CRUD
const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  let sauceObject = 0
  
    if (req.file) {
      Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlinkSync(`images/${filename}`)
      })
      sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    } else {
      sauceObject = { ...req.body }
    }
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
      .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch((error) => res.status(400).json({ error }))
    })
  })
  .catch((error) => res.status(500).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
    res.status(200).json(sauces);
  })
  .catch(
    (error) => {
      res.status(400).json({
      error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) =>{
    if(req.body.like ==1){//si user a like
      Sauce.updateOne({_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked:req.body.userId },_id:req.params.id } )//c est l id qu on va modifie
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
    }else if(req.body.like ==-1){//si user a dislike
      Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked:req.body.userId },_id:req.params.id } )
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
    }else if(req.body.like ==0){
      Sauce.findOne({_id: req.params.id})
      .then(sauces=> {
        if(sauces.usersLiked.find(user=> user===req.body.userId)){//si il avait like
          Sauce.updateOne({_id: req.params.id}, {$inc:{likes:-1}, $pull:{usersLiked:req.body.userId },_id:req.params.id } )
            .then(sauces=> res.status(200).json(sauces))
            .catch(error => res.status(400).json({error}));
        }
        if(sauces.usersDisliked.find(user=> user===req.body.userId)){//si il avait dislike
          Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:-1}, $pull:{usersDisliked:req.body.userId },_id:req.params.id } )
            .then(sauces=> res.status(200).json(sauces))
            .catch(error => res.status(400).json({error}));
        }
      })
      .catch(error=>console.log(error));
    }
}
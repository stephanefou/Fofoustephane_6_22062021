const passwordSchema = require('../models/Password');

//verification que le mot de passe saisie corresponde a la demande
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)){
    return res.status(400).json({ error: "Le mot de passe saisi n'est pas assez fort, il faut ' + passwordSchema.validate(req.body.password, { list: true })"});
  }else {
    next();
  }
}
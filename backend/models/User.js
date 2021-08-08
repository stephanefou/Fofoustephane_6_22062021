const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

/*
- token d'identification/jsonwebtoken
- Mongoose unique validator
- Sanitizer/ express-validator
- fonction d'encodage qui servira à l'email/function maskator(sentence)

*/
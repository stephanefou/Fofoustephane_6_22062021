const passwordValidator = require('password-validator');


const  passwordSchema = new passwordValidator();//schema MDP : min 5 caractères max 20 caractères/ min 2 minuscule / min 1 majuscule/ min 1 chiffre / pas d'espace / Blacklist these values ['Passw0rd', 'Password123']

passwordSchema
.is().min(5)
.is().max(20)
.has().uppercase(1)
.has().lowercase(1)
.has().digits(1)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = passwordSchema;
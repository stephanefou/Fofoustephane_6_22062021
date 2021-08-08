const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

/*router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;*/

const {body, validationResult} = require('express-validator');  // on importe le package express-validator

// cette fonction servira à express-validator
const sanitize = (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({error})  // code 400: bad request
    }
    next();      // si on ne trouve pas d'erreur par rapport à ce qu'on a demandé, on passe à la suite.
};

// la route pour se connecter, on précise l'uri (en utilisant les controllers dans le dossier contollers)
router.post('/signup', [
    body('email').isEmail(),                // ici, on utilise express-validator et on précise ce qu'on veut []
    body('password').isLength({min: 5})
    ], sanitize,                            // on vérifie avec la fonction créée plus haut si on a bien ce qu'on a demandé
    userCtrl.signup);   

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({min: 5})
    ], sanitize, 
    userCtrl.login);

module.exports = router;

const rateLimit = require('express-rate-limit'); // Use to limit repeated requests to public APIs and/or endpoints such as password reset

const limiter = rateLimit({ // limite le nombre d'identification
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, //limit each IP to 3 requests per windowMs
    message:
    "Too many accounts created from this IP, please try again after an hour",
});

module.exports = limiter ;
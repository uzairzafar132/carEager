const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Middleware function to check JWT token
const verifyToken = (req, res, next) => {
     const token = req.headers.authorization;
   // const token =`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTU1ZWY5OThkYjIzNWM0ZjMyODljNmIiLCJwaG9uZSI6MTIzNDU2Nzg5MDUsImlhdCI6MTcwMDEzMDc5MH0.UETU11GRxcDRXEt_CkoDpV2Oavi6DVy1WSGCElsQaDA`

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = verifyToken;


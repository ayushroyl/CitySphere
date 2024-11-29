const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Ensure the correct header is used
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.userId = decoded.id; // Attach user ID to the request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};



module.exports = authMiddleware;

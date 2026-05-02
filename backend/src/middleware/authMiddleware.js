const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === 'TEACHER') {
    next();
  } else {
    res.status(403).json({ message: 'Teacher access required' });
  }
};

module.exports = { protect, teacherOnly };

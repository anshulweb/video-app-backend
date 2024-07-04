import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.json({ message: 'Unauthorised user' });
  jwt.verify(token, process.env.JWT_SECERET, (err, user) => {
    if (err) return res.json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

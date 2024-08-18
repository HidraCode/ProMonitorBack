import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded; 
      next(); 
    } catch (err) {
      return res.status(401).send({ error: 'Invalid token' }); 
    }
};
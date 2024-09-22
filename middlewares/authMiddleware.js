import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Checa o token para permitir acesso a rota
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('auth:' + authHeader);
  
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });
  
  const token = authHeader.split(' ')[1];
  console.log(token)
  console.log(req.user)

  if (!token) return res.status(401).json({ message: 'Token inválido' });
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // const decodedToken = jwt.decode(token);
    // console.log(decodedToken);  // Verificar se `role` está presente
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Verifica se o usuário possui a role necessária para acessar a rota
export const authorizeRoles = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role == requiredRole) {
      next();
    }
    else {
      // console.log(req.user, req.user.role, requiredRole);
      return res.status(403).json({ message: 'Acesso negado' });
    }
  };
};
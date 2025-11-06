import jwt from 'jsonwebtoken';
import User from '../model/user-schema.js';

export async function protectedMiddleware(req, res, next) {
      console.log('JWT secret in middleware:', process.env.JWT_SECRET);

  try {
    const token = req.cookies.token;
   console.log('Token received in middleware:', token);
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not Found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in fetching data', err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error in protected Middlware' });
  }
}

import User from '../model/user-schema.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JSONWEB = process.env.JWT_SECRET;

export async function login(req, res){
  try {
    const user = req.user;
    console.log('request user', req.user);

    if(!user){
      return res.status(400).json({ message: 'User Cannot be found'});
    }

    const token = jwt.sign({
      id: user._id,
      username: user.username,
      email: user.email },
      JSONWEB,
      { expiresIn: '30d'}
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      samesite: 'none',
       maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

return res.status(200).json({
  message: `Welcome boss ${user.username}`,
  token,
  user: {
    _id: user._id,
    email: user.email,
  },
});



  } catch(err){
    console.error('Error fetching the data', err);
    return res.status(500).json({ message: 'Internal server Error'});
  }
}

export async function getAllUser(req, res){
  try {
    const loggedUserId = req.user._id;
    const filteredUser = await User.find({ _id: {$ne: loggedUserId}}).select('-password');

    return res.status(200).json(filteredUser);

  } catch (err){
    console.error('Error fetching all user', err);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}
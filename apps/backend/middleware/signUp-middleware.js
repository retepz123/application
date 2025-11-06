import User from '../model/user-schema.js';


export async function validateSignUp(req, res, next){
  try {
    const {username, email, password}  = req.body;
    console.log('request body:', req.body);

    //validate username and password
    if(!username || !email || !password){
      return res.status(400).json({ message: 'Username, E-mail and Password required'});
    }

    if(password.length < 5){
      return res.status(400).json({ message: 'Password should atleast 5 characters'});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
      return res.status(400).json({ message: 'Invalid E-mail format'});
    }

    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
      return res.status(400).json({ message: 'Email already use'});
    }

    const existing = await User.findOne({ username: username });

    if (existing){
      console.log('⚠️ Already exist Username');
      return res.status(400).json({ message: 'Already Exist User'});
    }

    next();

  } catch (err){
    console.error('Error in validate Sign Up', err);
    return res.status(500).json({ message: 'Internal Server Error in Sign up middleware'});
  }
}
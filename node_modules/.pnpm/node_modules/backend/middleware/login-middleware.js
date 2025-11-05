import User from '../model/user-schema.js';


export async function authLogin(req, res, next){
  try{
    const {username, password} = req.body;

    //validate the username and password
    if (!username || !password){
      return res.status(400).json({ message: 'Username and Password are required'});
    }

    //find user
    const user = await User.findOne({ username });

    if (!user){
      return res.status(400).json({ message: 'Cannot find the User'});
    }

    req.user = user;
    next();

  } catch (err){
    console.error('Error in fetching data', err);
    return res.status(500).json({ message: 'Internal Server Error in login Middleware'});
  }
}
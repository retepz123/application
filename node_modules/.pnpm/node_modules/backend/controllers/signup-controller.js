import User from '../model/user-schema.js';

export async function signUp(req, res) {
  try {
    const {username, email, password }= req.body;

    const user = await User.create({
      username,
      password,
      email,
    });

    return res.status(200).json({ message: 'Created Succesfully',
      user: {
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Error fetching the user', err);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}

import User from '../models/user.js'

export const addUser = async (req, res) => {
  const { name, email, image, oAuthId } = req.body;
  
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // If the user already exists, return a conflict status
    return res.status(200).json({ message: 'User with this email already exists', user: existingUser });
  }
  const newUser = new User({ name, email, image, oAuthId });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getUserByEmail = async (req, res) => {
  try {
    const user = await User.find({email:req.params.id});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndRemove(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  console.log("updatedUser",updatedUser);
  console.log("id",id);
  try {
    const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



// export const getImage = async (req, res) => {
//   const uploadPath = path.resolve(__dirname, '..', '..', 'uploads');
//   res.download(uploadPath+"/"+req.params.path)
// }
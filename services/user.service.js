mport User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';

const changeUserPasswordService = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword, passwordChangeAt: Date.now() },
    { new: true }
  );
  const token = createToken(user._id);
  return token;
};

const updateLoggedUserDataService = async (id, body) => {
  const user = await User.findByIdAndUpdate(id, { ...body }, { new: true });
  return user;
};

const deactivateService = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    { new: true }
  );
  return user;
};

export {
  changeUserPasswordService,
  updateLoggedUserDataService,
  deactivateService,
};

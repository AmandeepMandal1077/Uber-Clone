import RIDE from "../models/ride.model.js";
import USER from "../models/user.model.js";

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    if (!firstname || !email || !password) {
      throw new Error("Missing fields");
    }

    const newUser = await USER.create({
      fullname: { firstname, lastname },
      email,
      password,
    });

    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: \n${error.message}`);
  }
};

export { createUser };

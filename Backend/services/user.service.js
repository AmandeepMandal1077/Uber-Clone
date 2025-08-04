import USER from "../models/user.model.js";

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error("Missing fields");
  }

  const newUser = await USER.create({
    fullname: { firstname, lastname },
    email,
    password,
  });

  return newUser;
};

export { createUser };

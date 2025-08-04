import CAPTAIN from "../models/captain.model.js";

const createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  vehicleType,
  vehicleColor,
  vehicleCapacity,
  vehicleNumber,
}) => {
  try {
    if (
      !firstname ||
      !email ||
      !password ||
      !vehicleType ||
      !vehicleColor ||
      !vehicleCapacity ||
      !vehicleNumber
    ) {
      throw new Error("Missing fields");
    }

    const captain = await CAPTAIN.create({
      fullname: { firstname, lastname },
      email,
      password,
      vehicle: {
        type: vehicleType,
        color: vehicleColor,
        capacity: vehicleCapacity,
        number: vehicleNumber,
      },
    });

    return captain;
  } catch (error) {
    throw new Error(`Error creating captain: \n${error.message}`);
  }
};

export { createCaptain };

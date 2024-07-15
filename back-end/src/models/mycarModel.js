const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCarByUserId = async (userId) => {
  return await prisma.my_car.findUnique({
    where: { userId: userId },
  });
};

const updateCarByUserId = async (userId, updateData) => {
  return await prisma.my_car.update({
    where: { userId: userId },
    data: updateData,
  });
};

const updateUserVehicleByUserId = async (userId, updateData) => {
  return await prisma.user_vehicles.update({
    where: { userId: userId },
    data: updateData,
  });
};

const updateCarImageUrl = async (userId, imageUrl) => {
  return await prisma.my_car.update({
    where: { userId: userId },
    data: { imageUrl: imageUrl },
  });
};

module.exports = {
  getCarByUserId,
  updateCarByUserId,
  updateUserVehicleByUserId,
  updateCarImageUrl,
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMaintenanceItems = async (userId) => {
  return await prisma.maintenance_items.findMany({
    where: { userId },
  });
};

const createMaintenanceItem = async (data) => {
  return await prisma.maintenance_items.create({
    data,
  });
};

const createMaintenanceRecord = async (data) => {
  return await prisma.maintenance_records.create({
    data,
  });
};

const updateMaintenanceItem = async (id, data) => {
  return await prisma.maintenance_items.update({
    where: { id },
    data,
  });
};

const updateMaintenanceRecord = async (id, data) => {
  return await prisma.maintenance_records.update({
    where: { id },
    data,
  });
};

module.exports = {
  getMaintenanceItems,
  createMaintenanceItem,
  createMaintenanceRecord,
  updateMaintenanceItem,
  updateMaintenanceRecord,
};

const {
  getCarByUserId,
  updateCarByUserId,
  updateUserVehicleByUserId,
  updateCarImageUrl,
  getMaintenanceItemsByUserId,
} = require("../models/mycarModel");

const getCarInfo = async (req, res) => {
  const { userId } = req;

  try {
    const carInfo = await getCarByUserId(userId);
    if (carInfo) {
      res.status(200).json(carInfo);
    } else {
      res.status(404).json({ message: "Car information not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving car information", error });
  }
};

const updateCarInfo = async (req, res) => {
  const { userId } = req;
  const updateData = req.body;

  try {
    const updatedCarInfo = await updateCarByUserId(userId, updateData);

    // Check if the fields to update are also in user_vehicles
    const vehicleFieldsToUpdate = {};
    const vehicleFields = ["vehicle_name", "year", "fuel_type", "mileage"];

    vehicleFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        vehicleFieldsToUpdate[field] = updateData[field];
      }
    });

    if (Object.keys(vehicleFieldsToUpdate).length > 0) {
      await updateUserVehicleByUserId(userId, vehicleFieldsToUpdate);
    }

    res.status(200).json(updatedCarInfo);
  } catch (error) {
    res.status(500).json({ message: "Error updating car information", error });
  }
};

const uploadCarImage = async (req, res) => {
  const { userId } = req;
  console.log("Handling image upload for user:", userId);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files[0];
  console.log("Uploaded file details:", file);

  try {
    const imageUrl = file.location;
    await updateCarImageUrl(userId, imageUrl);
    res.status(200).json({ imageUrl: imageUrl });
  } catch (error) {
    console.error("Error uploading car image:", error);
    res.status(500).json({ message: "Error uploading car image", error });
  }
};

const getUserMaintenanceItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const items = await getMaintenanceItemsByUserId(userId);
    res.status(200).json(items);
  } catch (error) {
    console.error(
      `Error fetching maintenance items for user ${userId}:`,
      error
    );
    res
      .status(500)
      .json({ error: "유지보수 항목을 가져오는 중 오류가 발생했습니다." });
  }
};
module.exports = {
  getCarInfo,
  updateCarInfo,
  uploadCarImage,
  getUserMaintenanceItems,
};

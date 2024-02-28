// controllers/drivers.js

// Import the Driver model or any necessary dependencies
import Driver from '../models/driver.js';

// Controller to add a new driver
export const addDriver = async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();

    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get driver information by ID
export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a driver by ID
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a driver by ID
export const updateDriver = async (req, res) => {
  try {
      const updateFields = req.body;

      // Try to find the existing patient by userId
      const existingDriver = await Driver.findOne({ userId: req.params.id });

      if (existingDriver) {
          // If patient exists, update the existing patient
          const updatedDriver = await Driver.findOneAndUpdate(
              { userId: req.params.id },
              updateFields,
              { new: true }
          );

          res.status(200).json(updatedDriver);
      } else {
          // If patient doesn't exist, create a new patient
          const newDriver = await Driver.create({
              userId: req.params.id,
              ...updateFields,
          });

          res.status(201).json(newDriver); // Status 201 indicates resource creation
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
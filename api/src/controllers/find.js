import Patient from '../models/patient.js';
import Driver from '../models/driver.js';
import { trusted } from 'mongoose';


export const findClosestDriver = async (req, res) => {
  try {
    // Get patient's current latitude and longitude
    const patient = await Patient.findOne({ userId: req.params.patientId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientLatitude = patient.latitude;
    const patientLongitude = patient.longitude;

    // Fetch all drivers and their latitudes and longitudes
    const drivers = await Driver.find({ isOnline: false })

    // Find the closest driver
    let closestDriver = null;
    let closestDistance = Infinity;

    drivers.forEach((driver) => {
      const driverLatitude = driver.latitude;
      const driverLongitude = driver.longitude;

      // Calculate distance (you can use a more accurate formula based on your needs)
      const distance = Math.sqrt(
        Math.pow(driverLatitude - patientLatitude, 2) +
        Math.pow(driverLongitude - patientLongitude, 2)
      );

      // Update closest driver if the current driver is closer
      if (distance < closestDistance) {
        closestDriver = driver;
        closestDistance = distance;
      }
    });

    if (closestDriver) {
      await Driver.findByIdAndUpdate(closestDriver._id, { isOnline: true, patientId: patient._id });

      closestDriver = await Driver.findById(closestDriver._id).populate('userId').populate('patientId');
    }

    res.status(200).json({ closestDriver });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



export const findDriver = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.patientId });

    if (!patient) {
      // If patient not found, return a 404 response
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the first driver with a matching patientId
    const existingDriver = await Driver.findOne({ patientId: patient._id, isOnline: true });

    if (!existingDriver) {
      // If no matching driver found, return a 404 response
      return res.status(404).json({});
    }

    if (existingDriver) {
      await existingDriver.populate('userId')
    }

    res.status(200).json(existingDriver);
  } catch (error) {
    // Handle errors appropriately, e.g., send a 500 status code with an error message
    console.error(error);
    res.status(500).json({});
  }
};



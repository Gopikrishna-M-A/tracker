import Patient from '../models/patient.js';
import Driver from '../models/driver.js';


export const findDriver = async (req, res) => {
  try {
    // Get patient's current latitude and longitude
    const patient = await Patient.findOne({ userId: req.params.patientId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientLatitude = patient.latitude;
    const patientLongitude = patient.longitude;

    // Fetch all drivers and their latitudes and longitudes
    const drivers = await Driver.find({ isOnline: false }).populate('userId');

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
      await Driver.findByIdAndUpdate(closestDriver._id, { isOnline: true });

      // Set driver's patientLatitude and patientLongitude to the patient's coordinates
      closestDriver.patientLatitude = patient.latitude;
      closestDriver.patientLongitude = patient.longitude;

      // Save the changes to the driver document
      await closestDriver.save();
    }

    res.status(200).json({ closestDriver, closestDistance });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



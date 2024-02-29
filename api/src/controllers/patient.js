// controllers/patient.js

// Import the Patient model or any necessary dependencies
import Patient from '../models/patient.js';

// Controller to add a new patient
export const addPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get patient information by ID
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a patient by ID
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a patient by ID
export const updatePatient = async (req, res) => {
  try {
      const updateFields = req.body;

      // Try to find the existing patient by userId
      const existingPatient = await Patient.findOne({ userId: req.params.id });

      if (existingPatient) {
          // If patient exists, update the existing patient
          const updatedPatient = await Patient.findOneAndUpdate(
              { userId: req.params.id },
              updateFields,
              { new: true }
          ).populate("userId")

          res.status(200).json(updatedPatient);
      } else {
          // If patient doesn't exist, create a new patient
          const newPatient = await Patient.create({
              userId: req.params.id,
              ...updateFields,
          });

          res.status(201).json(newPatient); // Status 201 indicates resource creation
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
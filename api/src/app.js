import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './config.js';



import userRoutes from './routes/user.js'; 
import driverRoutes from './routes/driver.js';
import patientRoutes from './routes/patient.js';
import findDriver from './routes/find.js';

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  Headers: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}; 

app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/user',userRoutes)
app.use('/api/driver',driverRoutes)
app.use('/api/patient',patientRoutes)
app.use('/api/find',findDriver)


const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});

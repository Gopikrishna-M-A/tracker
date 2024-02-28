import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });


const Pass_Key = process.env.PASS_KEY;
const user_id = process.env.USER_ID;
const db_Name = process.env.DB_NAME;

const DB_URI = `mongodb+srv://${user_id}:${encodeURIComponent(Pass_Key)}@${db_Name}`;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));



 export default mongoose;

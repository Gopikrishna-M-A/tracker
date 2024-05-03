// import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// const hospitalMailIds = ["gopikrishna6003@gmail.com", "qwe@gmail.com", "poq@gmail.com"];

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#2F2E2E", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
  callbacks: {
    async session({ session }) {  
      const response = await fetch(
        `${baseURL}/api/user/email/${session.user.email}`,
        { method: "GET" }
      );

      const data = await response.json();


     

        

      
       
      session.user.isHospital = data[0].isHospital
      session.user._id = data[0]._id;
      session.user.phone = data[0].phone;
      session.user.address = data[0].address;
      return session;
    },
  },
};

'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const page = () => {
    const { data: session } = useSession()
    const [user, setUser] = useState(session?.user)
    const [driver, setDriver] = useState()
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
      axios.get(`${baseURL}/api/user/${user?._id}`).then((res)=>{
        setUser(res.data)
        console.log("res",res.data);
      })
    }, [])


    useEffect(() => {
        const updateLocation = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                if (user) {
                    axios.patch(`${baseURL}/api/driver/${user._id}`, { latitude: position.coords.latitude, longitude: position.coords.longitude })
                      .then((res) => {
                        console.log("driver location updated:", res.data);
                        setDriver(res.data)
                      })
                      .catch((error) => {
                        console.error("Error updating driver location:", error.message);
                      });
                }
              },
              (error) => {
                console.error("Error getting the current location:", error.message);
              }
            );
          }
        };
    
      // Update location initially and then every 5 seconds
      updateLocation();
      const intervalId = setInterval(updateLocation, 5000);
    
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, []); // Include user in the dependency array to update when user changes
    


  return (
    <div className='mt-10 flex justify-center items-center flex-col gap-5'>

        <div>Driver</div>

        {driver?.isOnline && (
          <div>
              <a className='text-blue-700' href={`https://www.google.com/maps/dir/?api=1&origin=${driver?.latitude},${driver?.longitude}&destination=${driver?.patientLatitude},${driver?.patientLongitude}`}>map</a>
          </div>
          
        )}

    </div>
  )
}

export default page
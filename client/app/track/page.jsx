'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const page = () => {
    const { data: session } = useSession()
    const [user, setUser] = useState(session?.user)
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [closestDriver, setClosestDriver] = useState(null);

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
                if (user.isDriver) {
                  axios.patch(`${baseURL}/api/driver/${user._id}`, { latitude: position.coords.latitude, longitude: position.coords.longitude })
                    .then((res) => {
                      console.log("Driver location updated:", res.data);
                    })
                    .catch((error) => {
                      console.error("Error updating driver location:", error.message);
                    });
                } 
                if (!user.isDriver) {
                  axios.patch(`${baseURL}/api/patient/${user._id}`, { latitude: position.coords.latitude, longitude: position.coords.longitude })
                    .then((res) => {
                      console.log("Patient location updated:", res.data);
                    })
                    .catch((error) => {
                      console.error("Error updating patient location:", error.message);
                    });
                }
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
    }, [user]); // Include user in the dependency array to update when user changes
    


    const handleAlert = () => {
      axios.get(`${baseURL}/api/find/find-closest-driver/${user?._id}`).then((res)=>{
        console.log("res",res.data);
        setClosestDriver(res.data.closestDriver)
      })
    }

    const handleCancel = () => {
      axios.patch(`${baseURL}/api/driver/${closestDriver?.userId}`, { isOnline: false, patientLatitude: 0, patientLongitude: 0 }).then((res)=>{
        console.log("res",res.data);
        setClosestDriver(null)
      })
    }

  return (
    <div className='mt-10 flex justify-center items-center flex-col gap-5'>

        {user?.isDriver ? <div>Driver</div> : <div>Patient</div>}

        {closestDriver?.isOnline && (
          <div>
              <h1>Driver</h1>
              <a href={`https://www.google.com/maps/dir/?api=1&origin=${closestDriver.latitude},${closestDriver.longitude}&destination=${closestDriver.patientLatitude},${closestDriver.patientLongitude}`}>map</a>
          </div>
          
        )}

        {!user?.isDriver  && <Button onClick={handleAlert}>Alert</Button>}
        {!user?.isDriver  && <Button onClick={handleCancel}>Cancel</Button>}
        {closestDriver  && <div >{closestDriver.userId.name}</div>}
    </div>
  )
}

export default page
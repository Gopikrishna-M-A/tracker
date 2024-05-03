"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const Hospital = ({ setToggle }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [refreshTimer, setRefreshTimer] = useState(5);
  const [driver, setDriver] = useState();
  const [distance,setDistance] = useState()
  const [estimatedTime, setEstimatedTime] = useState();

  const fetchDriver = () => {
    if (user) {
      axios
        .get(`${baseURL}/api/driver/get-hospital-driver/${user._id}`)
        .then((res) => {
          console.log("driv", res.data.drivers);
          setDriver(res.data.drivers);
        });
    }
    
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert latitude difference to radians
    const dLon = (lon2 - lon1) * Math.PI / 180; // Convert longitude difference to radians
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  useEffect(() => {
    if (latitude && longitude && driver) {
      const dist = calculateDistance(latitude, longitude, driver.latitude, driver.longitude);
      setDistance(dist);
      // Assuming average driving speed of 60 km/h
      const estimatedTime = dist / 60; // in hours
      setEstimatedTime(estimatedTime);
    }

    
  }, [latitude, longitude, driver]);



  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error("Error getting the current location:", error.message);
          }
        );
      }

      fetchDriver();
    };

    // Update location initially and then every 5 seconds
    updateLocation();
    const intervalId = setInterval(updateLocation, 5000);
    const interval2Id = setInterval(() => {
      setRefreshTimer((prevTimer) => (prevTimer > 1 ? prevTimer - 1 : 5)); // Decrease the timer every second
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(interval2Id);
    };
  }, []);

  const removeUserFromHospitals = () => {
    axios
      .patch(`${baseURL}/api/user/${user._id}`, {
        isHospital: false,
      })
      .then((res) => {
        console.log("res", res);
      });
    setToggle((prev) => !prev);
  };



  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="font-bold uppercase ">hospital tracking page</div>
      <Button onClick={removeUserFromHospitals} variant="destructive">
        Remove Hospital
      </Button>
      <div className="flex gap-2 flex-col">
        <div className="border p-5 rounded flex flex-col ">
          <div>driver ({driver?.userId?.name})</div>
          <div>
            latitude : <span>{driver?.latitude}</span>
          </div>
          <div>
            longitude : <span>{driver?.longitude}</span>
          </div>
        </div>
        <div className="border p-5 rounded flex flex-col">
          <div>Hospital ({user?.name})</div>
          <div>
            latitude : <span>{latitude}</span>
          </div>
          <div>
            longitude : <span>{longitude}</span>
          </div>
        </div>
      </div>
      <div className="font-semibold">Distance: {distance?.toFixed(2)} km</div>
      <div className="font-semibold">Estimated Time: {estimatedTime?.toFixed(2)} hours</div>
    </div>
  );
};

export default Hospital;

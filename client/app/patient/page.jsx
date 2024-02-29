"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const page = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [closestDriver, setClosestDriver] = useState(null);
  const [patient, setPatient] = useState({});
  const [refreshTimer, setRefreshTimer] = useState(5);

  useEffect(() => {
    axios.get(`${baseURL}/api/user/${user?._id}`).then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (user) {
              axios
                .patch(`${baseURL}/api/patient/${user._id}`, {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                })
                .then((res) => {
                  // console.log("patient location updated:", res.data);
                  setPatient(res.data);
                })
                .catch((error) => {
                  console.error(
                    "Error updating patient location:",
                    error.message
                  );
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
    const interval2Id = setInterval(() => {
      setRefreshTimer((prevTimer) => (prevTimer > 1 ? prevTimer - 1 : 5)); // Decrease the timer every second
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(interval2Id);
    };
  }, []); // Include user in the dependency array to update when user changes

  useEffect(() => {
    const getDriver = () => {
      // console.log("id", user._id);
      axios
        .get(`${baseURL}/api/find/find-driver/${user._id}`)
        .then((res) => {
          setClosestDriver(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          setClosestDriver(null);
        });
    };

    const intervalId = setInterval(getDriver, 5000);

    // Cleanup interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleAlert = () => {
    axios
      .get(`${baseURL}/api/find/find-closest-driver/${user?._id}`)
      .then((res) => {
        // console.log("closest driver:", res.data.closestDriver);
        setClosestDriver(res.data.closestDriver);
      });
  };

  const handleCancel = () => {
    axios
      .patch(`${baseURL}/api/driver/${closestDriver?.userId?._id}`, {
        isOnline: false,
        patientLatitude: 0,
        patientLongitude: 0,
      })
      .then((res) => {
        setClosestDriver(null);
      });
  };

  return (
    <div className="w-full  mt-10 flex flex-col justify-center items-center gap-5">
      <div className="w-full flex  flex-col gap-5 items-center">
        <div className="text-left text-xs border rounded px-2 py-1 border-yellow-500 bg-yellow-200 text-yellow-600 ">
          Refreshing in {refreshTimer}s
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Patient</CardTitle>
            <CardDescription>
              {patient?.userId?.name}
              <br />
              {patient?.userId?.email}
            </CardDescription>
          </CardHeader>
        </Card>
        {closestDriver && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Driver</CardTitle>
                <CardDescription>
                  {closestDriver?.userId?.name}
                  <br />
                  {closestDriver?.userId?.email}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="secondary" onClick={handleCancel}>
                  Dismiss Alert
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {!closestDriver && (
        <div className=" flex  gap-3">
          <Button variant="destructive" onClick={handleAlert}>
            Alert
          </Button>
        </div>
      )}
    </div>
  );
};

export default page;

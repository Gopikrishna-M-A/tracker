"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const [driver, setDriver] = useState();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [refreshTimer, setRefreshTimer] = useState(5);
  const [online, setOnline] = useState(false);

  const [hospitals, setHospitals] = useState([]);

  const fetchHospitals = () => {
    console.log("inside fetch");
    axios.get(`${baseURL}/api/user`).then((res) => {
      const hospitals = res.data.filter((user) => user.isHospital === true);
      console.log("hospitals", hospitals);
      setHospitals(hospitals);
    });
  };
  useEffect(() => {
    axios.get(`${baseURL}/api/user/${user?._id}`).then((res) => {
      setUser(res.data);
    });
    fetchHospitals();
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (user) {
              axios
                .patch(`${baseURL}/api/driver/${user._id}`, {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                })
                .then((res) => {
                  console.log("driver location updated:", res.data);
                  setDriver(res.data);
                  setOnline(res.data.isOnline);
                })
                .catch((error) => {
                  console.error(
                    "Error updating driver location:",
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
  }, []); 

  useEffect(() => {
    if (online) {
      toast.success(`New patient assigned. Please proceed to assist.`, {
        position: "top-center",
      });
    }
  }, [online]);

  const handleCancel = () => {
    axios
      .patch(`${baseURL}/api/driver/${driver?.userId?._id}`, {
        isOnline: false,
        patientId: null,
        hospital: null,
      })
      .then((res) => {
        console.log("res", res.data);
        setOnline(false);
      });
  };

  const setHospital = (id) => {
    axios
      .patch(`${baseURL}/api/driver/${driver?.userId?._id}`, {
        hospital:id,
      })
      .then((res) => {
        console.log("res", res.data);
      });
  };

  const removeHospital = () => {
    axios
      .patch(`${baseURL}/api/driver/${driver?.userId?._id}`, {
        hospital:null,
      })
      .then((res) => {
        console.log("res", res.data);
      });
  };

  return (
    <div className="w-full  mt-10 flex justify-center items-center gap-5 flex-col ">
      <div className="text-left text-xs border rounded px-2 py-1 border-yellow-500 bg-yellow-200 text-yellow-600 ">
        Refreshing in {refreshTimer}s
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Driver</CardTitle>
            <CardDescription>
              {driver?.userId?.name}
              <br />
              {driver?.userId?.email}
            </CardDescription>
          </CardHeader>
        </Card>

        {online && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Patient</CardTitle>
                <CardDescription>
                  {driver?.patientId?.userId?.name}
                  <br />
                  {driver?.patientId?.userId?.email}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${driver?.latitude},${driver?.longitude}&destination=${driver?.patientId?.latitude},${driver?.patientId?.longitude}`}
                  >
                    <Button variant="secondary">map</Button>
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="text-lg font-bold"> Hospitals ({driver?.hospital?.name})</div>
        <div>
          {hospitals.map((hospital) => (
            <div className="flex gap-3">
              <div className="bg-gray-600 text-white py-1 px-3 rounded">
                {hospital.name}
              </div>
              <Button onClick={() => setHospital(hospital._id)}>Set</Button>
              <Button onClick={removeHospital}>Remove</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

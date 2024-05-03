"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import Hospital from "../components/Hospital";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function TabsDemo() {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const [loading, setLoading] = useState(false);
  const [toggle,setToggle] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/user/${user?._id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      // Handle the error as needed, e.g., set an error state
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, [toggle]);

  const handleSave = (bool) => {
    axios
      .patch(`${baseURL}/api/user/${user._id}`, { isDriver: bool })
      .then((res) => {
        toast.success(
          `${user?.name} updated role to ${
            res.data.result.isDriver ? "Driver" : "Patient"
          }`,
          {
            position: "top-center",
          }
        );
        setUser(res.data.result);
        console.log("user", res.data.result);
      });
  };

  const addUserAsHospital = () => {
    axios
      .patch(`${baseURL}/api/user/${user._id}`, {
        isHospital: true,
        isDriver: false,
      })
      .then((res) => {
        console.log("res", res);
      });
      setToggle((prev=>!prev))
  };

  return (
    <div className="mt-10 w-full flex justify-center items-center flex-col gap-5">
      {user ? (
        user.isHospital ? (
          <div className="w-full">
            <Hospital setToggle={setToggle}/>
          </div>
        ) : (
          <div>
            {!loading ? (
              <Tabs
                defaultValue={user.isDriver ? "driver" : "patient"}
                className="w-[400px] "
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger onClick={() => handleSave(true)} value="driver">
                    Driver
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => handleSave(false)}
                    value="patient"
                  >
                    Patient
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className=" animate-pulse">Loading</div>
            )}
            <div className="mt-10 flex justify-between items-center">
              <a href={`\ ${user.isDriver ? "driver" : "patient"}`}>
                <Button>Start Tracking</Button>
              </a>
              <Button variant="outline" onClick={addUserAsHospital}>
                Add Hospital
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className=" animate-bounce select-none">Sign in to continue</div>
      )}
    </div>
  );
}

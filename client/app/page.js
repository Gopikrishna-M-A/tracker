'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import axios from "axios"
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"


export default function TabsDemo() {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  

  const handleSave = (bool) => {
    console.log(bool);
    axios.patch(`${baseURL}/api/user/${user._id}`,{isDriver:bool}).then((res)=>{
      console.log("res",res);
    })
  }



  return (
    <div className="mt-10 flex justify-center items-center">
      <Tabs defaultValue="account" className="w-[400px] ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="driver">Driver</TabsTrigger>
        <TabsTrigger value="patient">Patient</TabsTrigger>
      </TabsList>
      <TabsContent value="driver">
        <Card>
          <CardHeader>
            <CardTitle>Driver</CardTitle>
            <CardDescription>
              driver
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={()=>handleSave(true)}>Save</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="patient">
        <Card>
          <CardHeader>
            <CardTitle>patient</CardTitle>
            <CardDescription>
              patient
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={()=>handleSave(false)}>Save</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
    
  )
}

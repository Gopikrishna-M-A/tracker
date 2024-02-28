import "./globals.css";
import Navbar from "../components/Navbar";
import { getServerSession } from "next-auth/next";
import { options } from "../app/api/auth/[...nextauth]/options";
import Session from "../components/Session";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body>
        <Session session={session}>
              <Navbar session={session} />
              {children}
        </Session>
      </body>
    </html>
  );
}

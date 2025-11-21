"use client";
import UserContext from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { useContext, useEffect } from "react";

const Home = () => {
  const session = useSession();
  const { setTitle } = useContext(UserContext);
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (session && session?.data?.user?.accessToken) {
      if (pathName == "/") {
        router.push("/dailyreporting/by-user");
      }
    } else {
      router.push("/auth/signin");
    }
  });
  setTitle(`Welcome ${session?.data?.user?.fullName}'s Dashboard - Acewebx`);

  return (
    <>
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
          Welcome To Your Daily
          <br className="max-md:hidden" />
          <span className="orange_gradient text-center">
            {" "}
            CRM Reporting Hub.{" "}
          </span>
        </h1>
      </section>
    </>
  );
};

export default Home;

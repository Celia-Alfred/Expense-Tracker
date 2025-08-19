"use client";

import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Show nothing until user check is complete

  useEffect(() => {
    if (user) {
      checkUserBudgets();
    }
  }, [user]);

  const checkUserBudgets = async () => {
    try {
      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

      if (result.length === 0) {
        router.replace("/dashboard/budget");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking user budgets:", error);
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="">
      {/* Left Sidebar */}
      <div className="fixed md:w-64 hidden md:block bg-slate-950 min-h-screen">
        <SideNav />
      </div>

      {/* Main Content Area */}
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

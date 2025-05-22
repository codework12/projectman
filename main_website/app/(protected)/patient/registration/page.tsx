import { NewPatient } from "@/components/new-patient";
import { getPatientById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Registration = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Please sign in to continue</div>;
  }

  const { data } = await getPatientById(userId);
  
  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-6xl w-full relative pb-10">
        <NewPatient data={data} type={!data ? "create" : "update"} />
      </div>
    </div>
  );
};

export default Registration;
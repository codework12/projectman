import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has role in metadata
  const hasRole = sessionClaims?.metadata?.role;
  
  // Only redirect if user has a role
  if (hasRole) {
    redirect("/landing");
  }

  // If no role, show onboarding
  return <OnboardingClient />;
}

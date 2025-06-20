import { Metadata } from "next";
import { RegisterForm } from "./_components/RegisterForm";
import { RegisterHero } from "./_components/RegisterHero";

export const metadata: Metadata = {
  title: "YLY Registration | Youth Leading Youth",
  description:
    "Register for YLY events and activities.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      <RegisterHero/> 
      <RegisterForm /> 
    </main>
  );
}

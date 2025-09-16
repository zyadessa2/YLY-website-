"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define the validation schema using Yup - Updated for new structure
const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .matches(
        /^[a-zA-Z\s\u0600-\u06FF]+$/,
        "Name can only contain letters and spaces"
      )
      .required("Name is required"),
    age: yup
      .number()
      .min(16, "Age must be at least 16")
      .max(35, "Age must not exceed 35")
      .integer("Age must be a whole number")
      .required("Age is required"),
    college: yup
      .string()
      .min(2, "College name must be at least 2 characters")
      .max(200, "College name must not exceed 200 characters")
      .required("College is required"),
    phone_number: yup
      .string()
      .matches(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number (e.g., 01012345678)"
      )
      .required("Phone number is required"),
    another_phone_number: yup.string(),
    national_id: yup
      .string()
      .matches(/^[0-9]{14}$/, "National ID must be exactly 14 digits")
      .required("National ID is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    committee: yup
      .string()
      .oneOf(["HR", "SM", "OR", "PR"], "Please select a valid committee")
      .required("Committee is required"),
    why_choose_committee: yup
      .string()
      .min(10, "Please provide at least 10 characters explaining your choice")
      .max(500, "Explanation must not exceed 500 characters")
      .required("Please explain why you chose this committee"),
    where_know_about_us: yup
      .string()
      .min(5, "Please provide at least 5 characters")
      .max(200, "Response must not exceed 200 characters")
      .required("Please tell us how you heard about us"),
    governorate: yup
      .string()
      .oneOf(
        [
          "Cairo",
          "Giza",
          "Alexandria",
          "Qalyubia",
          "Sharqia",
          "Dakahlia",
          "Beheira",
          "Kafr El Sheikh",
          "Gharbia",
          "Menoufia",
          "Ismailia",
          "Port Said",
          "Suez",
          "Aswan",
          "Luxor",
          "Red Sea",
          "South Sinai",
          "North Sinai",
          "Matrouh",
          "New Valley",
          "Assiut",
          "Sohag",
          "Qena",
          "Beni Suef",
          "Fayoum",
          "Minya",
        ],
        "Please select a valid governorate"
      )
      .required("Governorate is required"),
  })
  .required();

export const RegisterForm = () => {
  const t = useTranslations("registration");
  const [isSubmitted, setIsSubmitted] = useState(false); // State for submission status
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      age: undefined,
      college: "",
      phone_number: "",
      another_phone_number: "",
      national_id: "",
      email: "",
      committee: undefined,
      why_choose_committee: "",
      where_know_about_us: "",
      governorate: undefined,
    },
  });
  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);

    try {
      // Insert directly into Supabase
      const { data: result, error } = await supabase
        .from("registrations")
        .insert([
          {
            name: (data.name as string).trim(),
            age: parseInt(data.age as string),
            college: (data.college as string).trim(),
            phone_number: (data.phone_number as string).trim(),
            another_phone_number: data.another_phone_number
              ? (data.another_phone_number as string).trim()
              : null,
            national_id: (data.national_id as string).trim(),
            email: (data.email as string).trim().toLowerCase(),
            committee: (data.committee as string).trim(),
            why_choose_committee:
              (data.why_choose_committee as string)?.trim() || "",
            where_know_about_us:
              (data.where_know_about_us as string)?.trim() || "",
            governorate: (data.governorate as string).trim(),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        alert(`Registration failed: ${error.message || "Database error"}`);
      } else {
        console.log("Registration submitted successfully:", result);
        setIsSubmitted(true);
        reset(); // Reset form after successful submission
        // alert("Registration submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Registration failed due to a network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnotherResponse = () => {
    setIsSubmitted(false); // Hide success message
  }; // Updated committee options to match database constraints
  const committeeOptions = [
    { value: "OR", label: "Operations" },
    { value: "HR", label: "Human Resources" },
    { value: "SM", label: "Social Media" },
    { value: "PR", label: "PR" },
  ];
  // Updated Egyptian Governorates list to match database constraints
  const governorateOptions = [
    { value: "Cairo", label: "Cairo" },
    { value: "Giza", label: "Giza" },
    { value: "Alexandria", label: "Alexandria" },
    { value: "Qalyubia", label: "Qalyubia" },
    { value: "Sharqia", label: "Sharqia" },
    { value: "Dakahlia", label: "Dakahlia" },
    { value: "Beheira", label: "Beheira" },
    { value: "Kafr El Sheikh", label: "Kafr El Sheikh" },
    { value: "Gharbia", label: "Gharbia" },
    { value: "Menoufia", label: "Menoufia" },
    { value: "Ismailia", label: "Ismailia" },
    { value: "Port Said", label: "Port Said" },
    { value: "Suez", label: "Suez" },
    { value: "Aswan", label: "Aswan" },
    { value: "Luxor", label: "Luxor" },
    { value: "Red Sea", label: "Red Sea" },
    { value: "South Sinai", label: "South Sinai" },
    { value: "North Sinai", label: "North Sinai" },
    { value: "Matrouh", label: "Matrouh" },
    { value: "New Valley", label: "New Valley" },
    { value: "Assiut", label: "Assiut" },
    { value: "Sohag", label: "Sohag" },
    { value: "Qena", label: "Qena" },
    { value: "Beni Suef", label: "Beni Suef" },
    { value: "Fayoum", label: "Fayoum" },
    { value: "Minya", label: "Minya" },
  ];
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">{t("form.title")}</h2>

      {isSubmitted ? (
        <div className="text-center">
          <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
            {t("form.successMessage")}
          </p>
          <Button onClick={handleAnotherResponse}>
            {t("form.submitAnother")}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">{t("form.name.label")}</Label>{" "}
            <Input
              type="text"
              id="name"
              {...register("name")}
              disabled={isLoading}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          {/* Age */}
          <div className="grid gap-2">
            <Label htmlFor="age">{t("form.age.label")}</Label>
            <Input
              type="number"
              id="age"
              {...register("age")}
              disabled={isLoading}
              placeholder="16-35 years"
              min="16"
              max="35"
            />
            {errors.age && (
              <p className="text-red-500 text-sm">{errors.age.message}</p>
            )}
          </div>
          {/* College */}
          <div className="grid gap-2">
            <Label htmlFor="college">{t("form.college.label")}</Label>
            <Input
              type="text"
              id="college"
              {...register("college")}
              disabled={isLoading}
              placeholder="Your college/university name"
            />
            {errors.college && (
              <p className="text-red-500 text-sm">{errors.college.message}</p>
            )}
          </div>
          {/* Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="phone_number">{t("form.phoneNumber.label")}</Label>
            <Input
              type="tel"
              id="phone_number"
              {...register("phone_number")}
              disabled={isLoading}
              placeholder="01012345678"
              pattern="01[0125][0-9]{8}"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">
                {errors.phone_number.message}
              </p>
            )}
          </div>{" "}
          {/* Another Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="another_phone_number">
              {t("form.anotherPhoneNumber.label")}{" "}
              <span className="text-gray-500 text-sm">(Optional)</span>
            </Label>
            <Input
              type="text"
              id="another_phone_number"
              {...register("another_phone_number")}
              disabled={isLoading}
              placeholder="Enter another phone number (optional)"
            />
            {errors.another_phone_number && (
              <p className="text-red-500 text-sm">
                {errors.another_phone_number.message}
              </p>
            )}
          </div>
          {/* National ID */}
          <div className="grid gap-2">
            <Label htmlFor="national_id">{t("form.nationalId.label")}</Label>
            <Input
              type="text"
              id="national_id"
              {...register("national_id")}
              disabled={isLoading}
              placeholder="14-digit National ID"
              pattern="[0-9]{14}"
              maxLength={14}
            />
            {errors.national_id && (
              <p className="text-red-500 text-sm">
                {errors.national_id.message}
              </p>
            )}
          </div>
          {/* Email */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="email">{t("form.email.label")}</Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              disabled={isLoading}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          {/* Committee */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="committee">{t("form.committee.label")}</Label>
            <Controller
              name="committee"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="committee">
                    <SelectValue
                      placeholder={t("form.committee.placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {committeeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.committee && (
              <p className="text-red-500 text-sm">{errors.committee.message}</p>
            )}
          </div>
          {/* Why Choose Committee */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="why_choose_committee">
              {t("form.whyChooseCommittee.label")}
            </Label>
            <textarea
              id="why_choose_committee"
              {...register("why_choose_committee")}
              disabled={isLoading}
              placeholder="Explain why you chose this committee (10-500 characters)"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              minLength={10}
              maxLength={500}
            />
            {errors.why_choose_committee && (
              <p className="text-red-500 text-sm">
                {errors.why_choose_committee.message}
              </p>
            )}
          </div>
          {/* Where Know About Us */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="where_know_about_us">
              {t("form.whereKnowAboutUs.label")}
            </Label>
            <Input
              type="text"
              id="where_know_about_us"
              {...register("where_know_about_us")}
              disabled={isLoading}
              placeholder="How did you hear about us? (social media, friends, etc.)"
              maxLength={200}
            />
            {errors.where_know_about_us && (
              <p className="text-red-500 text-sm">
                {errors.where_know_about_us.message}
              </p>
            )}
          </div>
          {/* Governorate */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="governorate">{t("form.governorate.label")}</Label>
            <Controller
              name="governorate"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="governorate">
                    <SelectValue
                      placeholder={t("form.governorate.placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {governorateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.governorate && (
              <p className="text-red-500 text-sm">
                {errors.governorate.message}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <Button
              type="submit"
              className="w-full md:w-auto min-w-[140px] transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("form.submitButton")
              )}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};

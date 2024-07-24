"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormFeild from "../CustomFormFeild";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/Validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import Register from "@/app/patients/[userid]/register/page";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    console.log("Form submitted with values:", values); // Log form values
    setIsLoading(true);
    try {
      const userData = {
        username: values.username,
        email: values.email,
        phone: values.phone,
      };

      console.log("Submitting user data:", userData); // Log user data

      const newUser = await createUser(userData);
      console.log("User created:", newUser); // Log created user
      if (newUser) {
        console.log("Redirecting to user registration page..."); // Log redirection
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log("Error creating user:", error); // Log error
    }
    setIsLoading(false);
    console.log("Finished form submission"); // Log end of submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className=" space-y-4">
          <h1 className="header">Welcome... </h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information </h2>
          </div>
        </section>
        {/* Name */}
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="username"
          label="Full Name"
          placeholder="Nameer"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        />
        {/* Email and Phone  */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email icon"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone Number"
              placeholder="1234567890"
            />
          </div>
        </div>
        {/* Birthdate and Gender  */}
        <div className="flex flex-col  gap-6 xl:flex-row">
          <div className="xl:w-1/3">
          <CustomFormFeild
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
          /></div>
          <div className="xl:w-2/3">
          <CustomFormFeild
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-2 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          /></div>
          

          
        </div>
        {/* Address and Occupation  */}
        <div className="flex flex-col justify-between gap-6 xl:flex-row w-full">
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14th Street, Civil Lines"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="Occupation"
              label="Occupation"
              placeholder="Enter your occupation"
            />
          </div>
        </div>
        {/* Emergency Contact name and Phone number */}
        <div className="flex flex-col justify-between gap-6 xl:flex-row w-full">
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Enter your address"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Phone Number"
              placeholder="(+91) 1234567890"
            />
          </div>
        </div>
        {/* Medical Information  */}
        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information </h2>
            <p className="text-dark-700">Primary care physician</p>
          </div>
        </section>

        {/* Select your primary care physician */}
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select your primary physician"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border border-500"
                ></Image>
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormFeild>

        {/* Insurance Policy and Insurance Policy Number */}

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="ex: United Health Care"
            />
          </div>
          <div className="xl:w-1/2 ">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ex: 1234567890"
            />
          </div>
        </div>
        {/* Allergies & Current Medication */}
        <div className="flex flex-col  gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any):"
              placeholder="Ex: Peanuts, Pollen, etc."
            ></CustomFormFeild>
          </div>

          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medication (if any):"
              placeholder="Ex: Ibuprofen, Paracetamol, etc."
            ></CustomFormFeild>
          </div>
        </div>
        {/* Family medical history & Past Medical history */}
        <div className="flex flex-col  gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family Medical History (if relevant):"
              placeholder="Ex: Mother had breast cancer."
            ></CustomFormFeild>
          </div>

          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past Medical History (if any):"
              placeholder="Ex: Asthma diagnosis in childhood"
            ></CustomFormFeild>
          </div>
        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

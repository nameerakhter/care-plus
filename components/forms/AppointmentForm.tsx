"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFormFeild from "../CustomFormFeild";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/Validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";

import Image from "next/image";
import { SelectItem } from "../ui/select";

const AppointmentForm = ({userId, patientId, type}: {userId: string, patientId: string, type: "create" | "cancel"}) => {
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
        <h1 className="header">New Appointment </h1>
      </section>
      <p className="text-dark-700">Request a new appointment</p>
      {type !== "cancel" && (
        <CustomFormFeild
        control={form.control}
        fieldType={FormFieldType.SELECT}
        name="primaryPhysician"
        label="Doctor"
        placeholder="Select a Doctor"
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
      )}

        
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

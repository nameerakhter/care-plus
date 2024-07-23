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
import { genderOptions } from "@/constants";
import { Label } from "../ui/label";

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
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome... </h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information </h2>
          </div>
        </section>

        {/* Name */}

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="username"
          label='Full Name'
          placeholder="Nameer"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        />

        {/* Email and Phone  */}
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='email'
          label='Email'
          placeholder='example@gmail.com'
          iconSrc='/assets/icons/email.svg'
          iconAlt='email icon'
        />
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name='phone'
          label='Phone Number'
          placeholder='(+91) 1234567890'
        />
        </div>

        {/* Birthdate and Gender  */}
        
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormFeild
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {genderOptions.map((option, i) => (
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
            />
          </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

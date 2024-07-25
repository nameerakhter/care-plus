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
import { getAppointmentSchema} from "@/lib/Validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";

import Image from "next/image";
import { SelectItem } from "../ui/select";
import { stat } from "fs";
import { createAppointment } from "@/lib/actions/appointment.actions";



const AppointmentForm = ({userId, patientId, type}: {userId: string, patientId: string, type: "create" | "cancel"| "schedule"}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    console.log("Form submitted with values:", values); // Log form values
    setIsLoading(true);

    let status;
    switch (type) {
      case 'schedule':
        status = "scheduled";
      case 'create':
        status = "create";
        
        break;
    
      default: 
      status = "pending";
        break;
    }
    try {
      if(type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData)
        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`);
        }
      }

      

    } catch (error) {
      console.log("Error creating user:", error); // Log error
    }
    setIsLoading(false);
    console.log("Finished form submission"); // Log end of submission
  };

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
    case 'create':
      buttonLabel = 'Create Appointment';
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      
      break;
  
    default:
      break;
  }
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
      <CustomFormFeild
      fieldType={FormFieldType.DATE_PICKER}
      control={form.control}
      name="schedule"
      label="Expected appointment date"
      showTimeSelects
      dateFormat="MM/dd/yyyy -h:mm aa"></CustomFormFeild>

      <div className="flex flex-col gap-6 xl:flex-row ">
        <div className="w-1/2">
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          name="reason"
          label="Reason for appointment"
          placeholder="Ex: Annual checkup, follow-up, etc."/>

        </div>
        <div className="w-1/2">
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          name="note"
          label="Additional notes"
          placeholder="Ex: Prefer afternoon appointemnts (if possible)"/>
        </div>
        
      </div>

      {type === "cancel" && (
        <CustomFormFeild
        control={form.control}
        fieldType={FormFieldType.TEXTAREA}
        name="cancellationReason"
        label="Reason for cancellation"
        placeholder="Enter reason for cancellation"/>
      )}

        
        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn': 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
import { Doctors } from "@/constants";
import { getAppointments } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Success = async ({params:{userId}, searchParams}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || ""
  const appointment = await getAppointments(appointmentId);
  const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);


  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
        <div className="flex items-start">
            <Image
              src="/assets/icons/Logomark.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="mb-12 h-10 w-fit"
            ></Image>
            <p className="text-2xl">CarePlus+</p>
          </div></Link>
          <section className="flex flex-col items-center">
            <Image src="/assets/gifs/success.gif" alt="success" height={300} width={280}></Image>
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment has been successfully submitted!</span>
          </h2>
          <p>We will be in touch shortly to confirm.</p>
          </section>
          <section className="request-details">
            <p>Requested Appointment details</p>
            <div className="flex items-center gap-3">
              <Image
              src={doctor?.image!} alt={doctor?.name!} width={100} height={100} className="size-6"></Image>
            </div>
          </section>
      </div>
    </div>
  );
};

export default Success;

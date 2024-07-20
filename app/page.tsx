import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Todo: OTP verification
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="flex items-start">
            <Image
              src="/assets/icons/Logomark.svg"
              height={100}
              width={1000}
              alt="logo"
              className="mb-12 h-10 w-fit"
            ></Image>
            <p className="text-2xl">CarePlus+</p>
          </div>
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              ©2024 care-plus
            </p>
            <Link href='/?admin=true' className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>
      <Image src='/assets/images/onboarding-img.png' height={1000} width={1000} alt="onboarding" className="side-img max-w-[50%] rounded-[1vw]"></Image>
    </div>
  );
}

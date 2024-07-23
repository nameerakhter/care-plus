import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Register = async ({params:{userId}}: SearchParamProps) => {
  const user =  await getUser(userId)
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
          <RegisterForm user={user}/>
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              ©2024 care-plus
            </p>
            <Link href='/?admin=true' className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>
        <Image src='/assets/images/register-img.png' height={1000} width={1000} alt="onboarding" className="side-img max-w-[390px] rounded-[1vw]"></Image>
    </div>
  )
}

export default Register
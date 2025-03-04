import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId)

  Sentry.metrics.set('user_view_register', user.name)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container flex max-w-[860px] flex-col py-10">
          <div className="flex items-start">
            <Image
              src="/assets/icons/Logomark.svg"
              height={100}
              width={1000}
              alt="logo"
              className="mb-12 h-10 w-fit"
            />
            <p className="text-2xl">CarePlus+</p>
          </div>
          <RegisterForm user={user} />
          <p className="copyright py-12">©2024 care-plus</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="onboarding"
        className="side-img max-w-[390px] rounded-[1vw]"
      />
    </div>
  )
}

export default Register

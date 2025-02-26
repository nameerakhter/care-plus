import AppointmentForm from '@/components/forms/AppointmentForm'
import { Button } from '@/components/ui/button'
import { getPatient } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId)

  Sentry.metrics.set('user_view_new-appointment', patient.name)
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
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />
          <p className="copyright py-12">©2024 care-plus</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="onboarding"
        className="side-img max-w-[390px] rounded-[1vw]"
      />
    </div>
  )
}

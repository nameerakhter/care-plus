'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormFeild from '../CustomFormFeild'
import SubmitButton from '../SubmitButton'
import { Dispatch, SetStateAction, useState } from 'react'
import { getAppointmentSchema } from '@/lib/Validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'
import { FormFieldType } from './PatientForm'
import { Doctors } from '@/constants'

import Image from 'next/image'
import { SelectItem } from '../ui/select'
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.actions'
import { Appointment } from '@/types/appwrite.types'

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string
  patientId: string
  type: 'create' | 'cancel' | 'schedule'
  appointment?: Appointment
  setOpen?: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const AppointmentFormValidation = getAppointmentSchema(type)
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment
        ? new Date(appointment?.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment ? appointment.note : '',
      cancellationReason: (appointment && appointment.cancellationReason) || '',
    },
  })

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>,
  ) => {
    setIsLoading(true)

    let status
    switch (type) {
      case 'schedule':
        status = 'scheduled'
        break
      case 'cancel':
        status = 'cancelled'
        break
      default:
        status = 'pending'
    }
    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const newAppointment = await createAppointment(appointmentData)
        if (newAppointment) {
          form.reset()
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
          )
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        }
        const updatedAppointment = await updateAppointment(appointmentToUpdate)

        if (updatedAppointment) {
          setOpen && setOpen(false)
          form.reset()
        }
      }
    } catch (error) {}
    setIsLoading(false)
  }

  let buttonLabel
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment'
      break
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
      break
    default:
      buttonLabel = 'Submit Apppointment'
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === 'create' && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment </h1>
          </section>
        )}
        <p className="text-dark-700">Request a new appointment</p>
        {type !== 'cancel' && (
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
                    className="border-500 rounded-full border"
                  />
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
          dateFormat="MM/dd/yyyy -h:mm aa"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="reason"
              label="Reason for appointment"
              placeholder="Ex: Annual checkup, follow-up, etc."
              disabled={type === 'schedule'}
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="note"
              label="Additional notes"
              placeholder="Ex: Prefer afternoon appointemnts (if possible)"
              disabled={type === 'schedule'}
            />
          </div>
        </div>

        {type === 'cancel' && (
          <CustomFormFeild
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm

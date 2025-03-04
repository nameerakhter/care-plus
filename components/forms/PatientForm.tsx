'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import CustomFormFeild from '../CustomFormFeild'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { UserFormValidation } from '@/lib/Validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datepicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true)
    try {
      const userData = {
        username: values.username,
        email: values.email,
        phone: values.phone,
      }
      const newUser = await createUser(userData)
      if (newUser && !('error' in newUser)) {
        router.push(`/patients/${newUser.$id}/register`)
      }
    } catch (error) {
      throw new Error('Error creating user')
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there... </h1>
        </section>
        <p className="text-dark-700">Schedule your first appointment</p>

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="username"
          label="Name"
          placeholder="Nameer"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        />
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="example@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email icon"
        />
        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone Number"
          placeholder="(+91) 1234567890"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm

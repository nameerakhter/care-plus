'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl } from '@/components/ui/form'
import CustomFormFeild from '../CustomFormFeild'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { PatientFormValidation, UserFormValidation } from '@/lib/Validation'
import { useRouter } from 'next/navigation'
import { registerPatient } from '@/lib/actions/patient.actions'
import { FormFieldType } from './PatientForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '@/constants'
import { Label } from '../ui/label'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import FileUploader from '../FileUploader'

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      username: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true)
    if (!user || !user.$id) {
      setIsLoading(false)
      return
    }

    let formData

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })
      formData = new FormData()
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].name)
      try {
        const patient = {
          userId: user.$id,
          username: values.username,
          email: values.email,
          phone: values.phone,
          birthDate: new Date(values.birthDate),
          gender: values.gender,
          address: values.address,
          occupation: values.occupation,
          emergencyContactName: values.emergencyContactName,
          emergencyContactNumber: values.emergencyContactNumber,
          primaryPhysician: values.primaryPhysician,
          insuranceProvider: values.insuranceProvider,
          insurancePolicyNumber: values.insurancePolicyNumber,
          allergies: values.allergies,
          currentMedication: values.currentMedication,
          familyMedicalHistory: values.familyMedicalHistory,
          pastMedicalHistory: values.pastMedicalHistory,
          identificationType: values.identificationType,
          identificationNumber: values.identificationNumber,
          identificationDocument: values.identificationDocument
            ? formData
            : undefined,
          privacyConsent: values.privacyConsent,
        }
        const newPatient = await registerPatient(patient)

        if (newPatient) {
          router.push(`/patients/${user.$id}/new-appointment`)
        }
      } catch (error) {
        throw new Error('Error creating User')
      }
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-10"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome... </h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information </h2>
          </div>
        </section>

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="username"
          label="Full Name"
          placeholder="Nameer"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email icon"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone Number"
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/3">
            <CustomFormFeild
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />
          </div>
          <div className="xl:w-2/3">
            <CustomFormFeild
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-2 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
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
        </div>

        <div className="flex w-full flex-col justify-between gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14th Street, Civil Lines"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder="Enter your occupation"
            />
          </div>
        </div>

        <div className="flex w-full flex-col justify-between gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Enter your address"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Phone Number"
              placeholder="(+91) 1234567890"
            />
          </div>
        </div>

        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information </h2>
            <p className="text-dark-700">Primary care physician</p>
          </div>
        </section>

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select your primary physician"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="ex: United Health Care"
            />
          </div>
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ex: 1234567890"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any):"
              placeholder="Ex: Peanuts, Pollen, etc."
            />
          </div>

          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medication (if any):"
              placeholder="Ex: Ibuprofen, Paracetamol, etc."
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family Medical History (if relevant):"
              placeholder="Ex: Mother had breast cancer."
            />
          </div>

          <div className="xl:w-1/2">
            <CustomFormFeild
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past Medical History (if any):"
              placeholder="Ex: Asthma diagnosis in childhood"
            />
          </div>
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification </h2>
          </div>
        </section>

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="identificationType"
          label="Identification Type"
          placeholder="Select the ID type"
        >
          {IdentificationTypes.map((id) => (
            <SelectItem key={id} value={id}>
              <div className="flex cursor-pointer items-center gap-2">
                <p>{id}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormFeild>

        <CustomFormFeild
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="identificationNumber"
          label="Identification Number"
          placeholder="Ex: 1234567890"
        />

        <CustomFormFeild
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy </h2>
          </div>
        </section>

        <CustomFormFeild
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to the treatment policy"
        />
        <CustomFormFeild
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the disclosure policy"
        />
        <CustomFormFeild
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to the privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm

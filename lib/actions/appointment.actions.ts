'use server'
import { ID, Query } from 'node-appwrite'
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from '../appwrite.config'
import { formatDateTime, parseStringify } from '../utils'
import { Appointment } from '@/types/appwrite.types'
import { revalidatePath } from 'next/cache'

export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment,
    )
    return parseStringify(newAppointment)
  } catch {
    throw new Error('Failed to create Appointment')
  }
}

export const getAppointments = async (appointmentId: string) => {
  try {
    const appointments = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    )
    return parseStringify(appointments)
  } catch {
    throw new Error('Failed to fetch Appointment')
  }
}

export const getRecentAppointmentsList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
    )

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case 'scheduled':
            acc.scheduledCount++
            break
          case 'pending':
            acc.pendingCount++
            break
          case 'cancelled':
            acc.cancelledCount++
            break
        }
        return acc
      },
      initialCounts,
    )

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    }
    return parseStringify(data)
  } catch (error) {
    throw new Error('Error fetching appointments')
  }
}

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment,
    )

    if (!updatedAppointment) {
      throw new Error('Failed to update appointment')
    }

    const smsMessage = `
    Hi greetings from care-plus.
    ${
      type === 'schedule'
        ? `Your appointment has been scheduled ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}`
        : `We are sorry to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
    }
    `

    await sendSMSNotification(userId, smsMessage)

    revalidatePath('/admin')
    return parseStringify(updatedAppointment)
  } catch (error) {
    throw new Error('Error while generating Mesage')
  }
}

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId],
    )
    return parseStringify(message)
  } catch (error) {
    throw new Error('Error while sending SMS Message')
  }
}

'use server'
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from '../appwrite.config'
import { parseStringify } from '../utils'
import { ID, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

export const createUser = async (userData: CreateUserParams) => {
  try {

    const newUser = await users.create(
      ID.unique(),
      userData.email,
      userData.phone,
      undefined, 
      userData.username,
    )
    return newUser 
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([
        Query.equal('email', [userData.email]),
      ])
      return documents?.users[0] 
    }
    return undefined 
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId)
    return parseStringify(user)
  } catch{
      throw new Error(`Failed to get user`)
  }
}

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file

    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get('blobFile') as Blob,
          identificationDocument?.get('fileName') as string,
        )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      },
    )

    return parseStringify(newPatient)
  } catch{
    throw new Error("Failed to register patient")
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)],
    )
    return parseStringify(patients.documents[0])
  } catch {
    throw new Error("Failed to get patient")
  }
}

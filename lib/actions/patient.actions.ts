'use server'
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { ID, Query } from "node-appwrite";
import {InputFile} from 'node-appwrite/file'

export const createUser = async (userData: CreateUserParams) => {
    console.log("createUser called with:", userData); // Log the input data
    try {
      // Log each parameter to verify their values
      console.log(`Creating user with email: ${userData.email}`);
      console.log(`Creating user with phone: ${userData.phone}`);
      console.log(`Creating user with username: ${userData.username}`);
  
      const newUser = await users.create(
        ID.unique(),
        userData.email,
        userData.phone,
        undefined, // Password is optional, pass undefined if not setting
        userData.username
      );
  
      console.log("New user created:", newUser); // Log the created user
      return newUser; // Ensure that the new user is returned
    } catch (error: any) {
      console.error("createUser error:", error); // Log any errors
      if (error && error?.code === 409) {
        const documents = await users.list([
          Query.equal("email", [userData.email]),
        ]);
        return documents?.users[0]; // Return the existing user
      }
      return undefined; // Return undefined if an error occurs
    }
  };


export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error)
  }
}

export const registerPatient = async ({identificationDocument, ...patient}:RegisterUserParams) => {
  try {
    let file;

    if(identificationDocument){
      const inputFile = identificationDocument && InputFile.fromBuffer(
        identificationDocument?.get('blobFile')as Blob,
        identificationDocument?.get('fileName')as string

      )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }
    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
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
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error)
  }
}
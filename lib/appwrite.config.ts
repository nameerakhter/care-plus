import * as sdk from "node-appwrite";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_API_KEY: API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;
// console.log(`Appwrite Configuration:`);
// console.log(`ENDPOINT: ${ENDPOINT}`);
// console.log(`PROJECT_ID: ${PROJECT_ID}`);
// console.log(`API_KEY: ${API_KEY}`);


const client = new sdk.Client();

client.setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_PROJECT_ID!).setKey(process.env.NEXT_PUBLIC_API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

import * as sdk from "node-appwrite";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export const {
  ENDPOINT: ENDPOINT,
  PROJECT_ID: PROJECT_ID,
  API_KEY: API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  BUCKET_ID: BUCKET_ID,
} = process.env;
console.log(`Appwrite Configuration:`);
console.log(`ENDPOINT: ${ENDPOINT}`);
console.log(`PROJECT_ID: ${PROJECT_ID}`);
console.log(`API_KEY: ${API_KEY}`);


const client = new sdk.Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('669bf539001f596f6c1b').setKey('2a3aad2088179ca4fce40b20d836aef0ee38c53a39fd50c4c4c24eef94c3721f4a23276e89a4c401426f7edc73e02efcfcc2ec9725cde9abcc0eff244cbfb9dcf32331e096564377f0581c3f3cf5ecce35d360889f284ca7428aabdeea4062b5c0b8cb11bcba2c1aab47feffc43db8d5dd0f16591dc4bb5c9bd699e6be02a664');

// client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

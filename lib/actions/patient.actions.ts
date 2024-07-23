import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

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

import { ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"

export const createUser = async (userData: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), userData.email, userData.phone, undefined, userData.username)
        
    } catch (error:any) {
        if(error && error?.code === 409){
            const documents = await users.list([
                Query.equal('email', [userData.email])
            ])
            return documents?.users[0]
        }
    }
}
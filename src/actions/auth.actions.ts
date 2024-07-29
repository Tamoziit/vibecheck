//Holds Server Actions --> Funcs. that run on the server side
"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import toast from "react-hot-toast";

export async function checkAuthStatus() {
    const { getUser } = getKindeServerSession(); //returns authenticated user from Kinde
    const user = await getUser();

    if (!user) return { success: false };

    const userId = `user:${user.id}`;
    //eg: user:1234: {...} --> here "user" is the namespace assigned to hash id = 1234. Without namespaces, querying just by hash id in a db containing multiple hash data structures for different purposes(lyk user, messages, convo etc.), doesn't provide accurate results relevant to the query. Hence namespaces are assigned to hashed related to a particular collection/purpose in Redis.

    const existingUser = await redis.hgetall(userId); //gets all data or fields associated with a hash with id = userId

    //Signup: User visting for 1st time
    if (!existingUser || Object.keys(existingUser).length === 0) {
        //Object.keys(existingUser).length === 0 --> No key:value pair available, i.e., user DNE

        const imgIsNull = user.picture?.includes("gravatar"); //Checking if user pic url includes "gravatar" --> i.e, incase user doesn't have a picture already while signing up via Kinde, it provides the user with a default pic from gravatar
        const image = imgIsNull ? "" : user.picture;

        await redis.hset(userId, {
            id: user.id,
            email: user.email,
            name: `${user.given_name} ${user.family_name}`,
            image: image
        });
        
        //toast.success("Welcome to the place where Swag meets Vibe😎"); --> To FIX
    }

    return { success: true };
}
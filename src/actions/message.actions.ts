"use server";

import { Message } from "@/db/dummy";
import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type sendMessageActionArgs = {
    content: string;
    messageType: "text" | "image";
    receiverId: string;
};

export async function sendMessageAction({ content, messageType, receiverId }: sendMessageActionArgs) {
    const { getUser } = getKindeServerSession();
    const user = await getUser(); //get auth user

    if (!user) return { success: false, message: "User not authenticated" };
    const senderId = user.id;

    //Conversation
    const conversationId = `conversation:${[senderId, receiverId].sort().join(":")}`;
    /*NB: If we raw dawg this lyk conversation:senderId:receiverId --> 
    > Suppose we have user A:123 & B:456.
    > When A messages B, we have --> senderId: 123, receiverId: 456, hence the conversation is saved in db as `conversation:123:456`.
    > But when B messages A, we have --> senderId: 456, receiverId: 123, hence the conversation is saved in db as `conversation:456:123`.
    > Hence, although the convo is supposed to be same, but it is saved as different convos with differently arranged ids.
    > To fix this bug, when we save a convo in DB, we sort the ids of sender and receiver, so that, no matter who messages whom, after sorting the id of convo namespace rremains the same.
    > In this case, in both situations the convo is saved as `conversation:123:456`
    */

    const conversationExists = await redis.exists(conversationId);
    if (!conversationExists) {
        await redis.hset(conversationId, {
            participant1: senderId,
            participant2: receiverId
        }); //setting up a hashset for convo

        await redis.sadd(`user:${senderId}:conversations`, conversationId); //adding the newly created convo to the conversation list of the current user(sender)
        await redis.sadd(`user:${receiverId}:conversations`, conversationId); //same logic for the receiver
    }

    //Messages
    const messageId = `message:${Date.now()}:${Math.random().toString(36).substring(2, 9)}`; //custom unique messageId containing date, and some randomly generated alphanumerics
    const timestamp = Date.now();

    await redis.hset(messageId, {
        senderId,
        content,
        timestamp,
        messageType
    });

    await redis.zadd(`${conversationId}:messages`, { score: timestamp, member: JSON.stringify(messageId) }); //Pushing the message inside a sorted set for a convo, sorted according to the time they were sent/set to DB.

    return { success: true, conversationId, messageId };
}


export async function getMessages(selectedUserId: string, currentUserId: string) {
    const conversationId = `conversation:${[selectedUserId, currentUserId].sort().join(":")}`;
    const messageIds = await redis.zrange(`${conversationId}:messages`, 0, -1); //fetching all messages ids under a particular conversationId

    if (messageIds.length === 0) return []; //no messages in the convo

    const pipeline = redis.pipeline();
    messageIds.forEach((messageId) => pipeline.hgetall(messageId as string)); //getting all hashset info for each message
    const messages = await pipeline.exec() as Message[]; //exporting the messages as an array.

    return messages;
}
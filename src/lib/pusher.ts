//Config for Pusher :- Real-time client-server comms (analogous - socket.io)
import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
    var pusherServer: PusherServer | undefined;
    var pusherClient: PusherClient | undefined;
}

//Server instance
export const pusherServer = global.pusherServer || new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER! || "ap2",
    useTLS: true
});
/* NB: here, checking for a cached global instance of pusherSever is important coz, in development for each modifications made in the source code, Pusher creates new server connections which might go out of range for free tier. Checking for the already created & cached global instance helps in resolving this issue. */

//Client instance
export const pusherClient = global.pusherClient || new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.PUSHER_APP_CLUSTER! || "ap2"
}); //Same logic applies for client instance.
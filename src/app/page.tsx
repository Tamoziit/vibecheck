import Image from "next/image";
import PreferencesTab from "../components/PreferencesTab";
import ChatLayout from "@/components/chat/ChatLayout";
import { cookies } from "next/headers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { User } from "@/db/dummy";
import { redis } from "@/lib/db";

//Fetching users for the sidebar
async function getUsers(): Promise<User[]> {
  const userKeys: string[] = []; //keys of all users - by default an empty string array
  let cursor = "0"; //index or pointer to scan DB entries

  do {
    const [nextCursor, keys] = await redis.scan(cursor, { match: "user:*", type: "hash", count: 100 }); //getting all entries of the namespace user, like user:1201, user:2308 etc. NB: count specifies the max no. of users to be fetched at each scan or iteration (data chunking)
    cursor = nextCursor;
    userKeys.push(...keys); //pushing relevant users into the users array [user:123, user:456,...]
  } while (cursor !== "0");

  const { getUser } = getKindeServerSession();
  const currentUser = await getUser(); //logged in user

  const pipeline = redis.pipeline();
  userKeys.forEach(key => pipeline.hgetall(key)); //destructuring each entry of users array by their keys stored in the array to get their individual hashset values or the data each of them store.
  const results = (await pipeline.exec()) as User[]; //executing the pipeline to get a destructured array of users.

  const users: User[] = [];
  //Storing the fetched users except the current logged in user, in order to be displayed in the sidebar
  for (const user of results) {
    if (user.id !== currentUser?.id) {
      users.push(user);
    }
  }

  return users;
}

export default async function Home() {
  const layout = cookies().get("react-resizable-panels:layout"); //storing chat panels sizes in cookies to store theirs states over refreshes.
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) return redirect("/auth"); //not allowing un-authenticated users to visit the home page.

  const users = await getUsers(); //for sidebar users

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
      <PreferencesTab />

      {/* dotted bg */}
      <div
        className='absolute top-0 z-[-2] h-screen w-screen dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] 
				dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px]'
        aria-hidden='true'
      />

      <div className="z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm lg:flex">
        <ChatLayout defaultLayout={defaultLayout} users={users} />
      </div>
    </main>
  );
}

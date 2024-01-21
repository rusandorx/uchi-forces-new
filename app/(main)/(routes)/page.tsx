import { Lessons } from "@prisma/client";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const Page = async () => {
  await initialProfile();
  
  return redirect(`/lessons/home`);
}
 
export default Page;
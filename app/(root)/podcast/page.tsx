import React from 'react'
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import PodcastGenerator from '@/components/PodcastGenerator';
import { getCurrentUser } from '@/lib/get-current-user'

const Podcast = async () => {
  const isUserAuthenticated = await isAuthenticated();
  const user = await getCurrentUser()
  if (!isUserAuthenticated) redirect("/sign-in");
  return (
    <div>
      <PodcastGenerator user={user}/>
    </div>
  )
}

export default Podcast
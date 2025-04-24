import React from 'react'
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import PodcastGenerator from '@/components/PodcastGenerator';

const Podcast = async () => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  return (
    <div>
      <PodcastGenerator />
    </div>
  )
}

export default Podcast
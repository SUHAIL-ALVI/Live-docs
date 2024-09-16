"use client";

import Loader from "@/components/Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();

  const resolveUsers = async ({ userIds }: { userIds: string[] }) => {
    const users = await getClerkUsers({ userIds });
    return users;
  };

  const resolveMentionSuggestions = async ({
    text,
    roomId,
  }: {
    text: string;
    roomId: string;
  }) => {
    // Safely access email address with a default value or handle undefined case
    const currentUserEmail = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";

    const roomUsers = await getDocumentUsers({
      roomId,
      currentUser: currentUserEmail,
      text,
    });

    return roomUsers;
  };

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;

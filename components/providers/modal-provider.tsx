"use client";

import { useEffect, useState } from "react";

import { CreateModal } from "../modals/create-task-modal";
import { DeleteTaskModal } from "../modals/delete-task-modal";
import { EditTaskModal } from "../modals/edit-task-modal";
import { ProfilesModal } from "../modals/profiles-modal";
import useIsMounted from "@/hooks/use-is-mounted";

export const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <CreateModal/>
      <DeleteTaskModal/>
      <EditTaskModal/>  
      <ProfilesModal/>
    </>
  );
}
"use client";

import { cn, lessonsToRussian } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";
import { Lessons } from "@prisma/client";
import React from "react";

interface NavigationItemProps {
    content: React.ReactNode; // Probably icon idk
    name: string;
    lesson: Lessons | "home";
}

export const NavigationItem = ({
    content,
    name,
    lesson
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/lessons/${lesson ?? ''}`);
    };

    return (
      <ActionTooltip side="right" align="center" label={lessonsToRussian(name)}>
        <button onClick={onClick} className="group relative flex items-center">
          <div className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.lesson !== lesson && "group-hover:h-[20px]",
            params?.lesson === lesson ? "h-[36px]" : "h-[8px]"
          )} />
          <div className={cn("relative group flex mx-3 h-[48px] w-[48px] bg-white dark:bg-zinc-800 rounded-[16px] group-hover:rounded-[12px] transition-all overflow-hidden justify-center items-center", 
            params?.lesson === lesson && "bg-primary/10 text-primary rounded-[12px]"
          )}>
            {content}
          </div>
        </button>
      </ActionTooltip>
    );
}
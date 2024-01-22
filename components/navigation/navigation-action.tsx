"use client";

import { ModalData, ModalType, useModal } from "@/hooks/use-modal-store";

import { ActionTooltip } from "@/components/action-tooltip";
import { Plus } from "lucide-react";

interface NavigationActionProps {
	label: string;
	icon: React.ReactNode;
	action: ModalType | (() => void);
  data?: ModalData;
}

export const NavigationAction = ({
	label,
	icon,
	action,
  data
}: NavigationActionProps) => {
	const { onOpen } = useModal();

	return (
		<div>
			<ActionTooltip side="right" align="center" label={label}>
				<button
					className="group flex items-center"
					onClick={() =>
						{              
							return typeof action === "function" ? action() : onOpen(action, data);
						}
					}
				>
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						{icon}
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
};

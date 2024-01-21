"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Edit, Pencil, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "../action-tooltip";
import { Task } from "@prisma/client";
import { db } from "@/lib/db";
import { useModal } from "@/hooks/use-modal-store";

interface TaskSearchProps {
	data?: Task[];
}

export const TaskSearch = ({ data }: TaskSearchProps) => {
	const [open, setOpen] = useState(false);
	const { onOpen } = useModal();
	const router = useRouter();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key.toLocaleLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);

		return () => {
			document.removeEventListener("keydown", down);
		};
	}, []);

	const onClick = ({ id }: { id: string }) => {
		setOpen(false);
		router.replace(`/tasks/${id}`);
	};

	const onDelete = (id: string) => {
		setOpen(false);

		onOpen("deleteTask", { taskId: id });
	};

	const onEdit = async (task: Task) => {
		setOpen(false);
		onOpen("editTask", { task });
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="group flex items-center"
			>
				<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
					<Pencil size={25} />
				</div>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Искать все созданные задачи" />
				<CommandList>
					<CommandEmpty>Ничего не найдено</CommandEmpty>
					{data?.map((task) => {
						const { id, title } = task;
						return (
							<CommandItem
								key={id}
								onSelect={() => onClick({ id })}
								className="flex w-full group"
							>
								<span>{title}</span>
								<div className="ml-auto flex items-center gap-x-2">
									<ActionTooltip label="Изменить">
										<Edit
											className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
											onClick={() => onEdit(task)}
										/>
									</ActionTooltip>
									<ActionTooltip label="Удалить">
										<Trash
											className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
											onClick={() => onDelete(id)}
										/>
									</ActionTooltip>
								</div>
							</CommandItem>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};

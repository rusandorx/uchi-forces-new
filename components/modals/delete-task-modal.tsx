"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const DeleteTaskModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "deleteTask";
	const { taskId } = data;

	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/tasks/${taskId}`);
			onClose();
			router.refresh();
			router.push("/");
		}
		catch (error) { console.log(error) }
		finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Удалить задачу
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Вы уверены, что хотите удалить задачу?<br />
						Это будет нельзя обратить.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex justify-between items-center w-full">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Отмена
						</Button>
						<Button disabled={isLoading} onClick={onClick} variant="primary">
							Удалить
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

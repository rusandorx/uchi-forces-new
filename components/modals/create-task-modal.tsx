"use client";

import * as z from "zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FilesUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Lessons } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { lessonsToRussian } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const getDifficultyAsString = (difficulty: number) => {
	if (difficulty < 3) return "Очень легкая";
	if (difficulty < 5) return "Легкая";
	if (difficulty < 7) return "Средняя";
	if (difficulty < 9) return "Сложная";
	return "Очень сложная";
};

export const CreateModal = () => {
	const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createTask";


	const [isMounted, setIsMounted] = useState(false);

	const router = useRouter();

	useEffect(() => setIsMounted(true), []);

	const formSchema = z.object({
		title: z.string().min(1, {
			message: "Необходимо добавить название задачи.",
		}),
		description: z.string().min(1, {
			message: "Необходимо добавить описание задачи.",
		}),
		difficulty: z.coerce.number().min(1).max(10),
		taskImages: z
			.array(z.string().min(1))
			.max(3, "Нельзя приложить больше 3 картинок."),
		answer: z.string().min(1, {
			message: "Необходимо добавить ответ к задаче.",
		}),
		points: z.coerce.number().min(1).max(100),
		solution: z.string().min(1, {
			message: "Необходимо добавить решение к задаче.",
		}),
		solutionImages: z
			.array(z.string().min(1))
			.max(3, "Нельзя приложить больше 3 картинок."),
		lesson: z.nativeEnum(Lessons),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			difficulty: 5,
			lesson: Lessons.Math,
			taskImages: [],
			answer: "",
			points: 30,
			solution: "",
			solutionImages: [],
		},
	});

	if (!isMounted) return null;

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post("/api/tasks", values);
			form.reset();
			router.refresh();
			onClose();
		} catch (e) {
			console.log(e);
		}
	};

	const { difficulty } = form.getValues();

  const handleClose = () => {
    form.reset();
    onClose();
  }

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-y-scroll max-h-screen">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Создание новой задачи
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Создайте новую задачу, которую смогут решать
						пользователи. Вы можете добавить картинки и описание к
						задаче.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Название задачи
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Введите название задачи"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Описание задачи
										</FormLabel>
										<FormControl>
											<Textarea
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 overflow-y-hidden"
												placeholder="Введите условие задачи"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lesson"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Предмет, к которому относится задача.</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Выберите предмет" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(Lessons).map(
													(value) => (
														<SelectItem
															key={value}
															value={value}
															className="capitilize"
														>
															{lessonsToRussian(value).toLowerCase()}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="taskImages"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
												Приложите фото к условию задачи
											</FormLabel>
											<FormControl>
												<FilesUpload
													endpoint="taskImages"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="difficulty"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Сложность задачи{" "}
											<span
												style={{
													color: `#${Math.floor(
														(255 / 10) * difficulty
													).toString(16)}2222`,
												}}
											>{`(${getDifficultyAsString(
												difficulty
											)})`}</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												type={"number"}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Укажите сложность задачи"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="points"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Очки за выполнение задачи
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												type={"number"}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Укажите количество очков за успешное выполнение задачи"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="answer"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Ответ к задаче
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Введите верный ответ к задаче"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="solution"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Решение задачи
										</FormLabel>
										<FormControl>
											<Textarea
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 overflow-y-hidden"
												placeholder="Добавьте полное решение к задаче"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="solutionImages"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
												Приложите фото к решению задачи
											</FormLabel>
											<FormControl>
												<FilesUpload
													endpoint="solutionImages"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button disabled={isLoading} variant="primary">
								Создать
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

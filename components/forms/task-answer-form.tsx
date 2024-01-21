"use client";

import * as z from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useReducer, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

export const TaskAnswerForm = ({ taskId }: { taskId: string }) => {
  const [, rerender] = useReducer(x => x + 1, 0);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const formSchema = z.object({
		answer: z.string().min(1, { message: "Введите ответ!" }),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			answer: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
      
			await axios.post(`/api/tasks/${taskId}/solve`, values);
      router.refresh();
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	const onGiveup = async () => {
		try {
			setIsLoading(true);
			await axios.post(`/api/tasks/${taskId}/giveup`);
			router.refresh();
      
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-end">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-2 relative left-[-20px]"
				>
					<FormField
						control={form.control}
						name="answer"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										disabled={isLoading}
										className="bg-zinc-700 border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0 overflow-y-hidden"
										placeholder="Введите ответ к задаче"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={isLoading} variant="primary">
						Ответить
					</Button>
				</form>
			</Form>
			<button className="underline  opacity-80 hover:opacity-95" onClick={onGiveup}>
				Сдаться
			</button>
		</div>
	);
};

"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Lessons, Profile } from "@prisma/client";

import { ActionTooltip } from "../action-tooltip";
import { Form } from "../ui/form";
import Image from "next/image";
import Link from "next/link";
import { ProfileWithTasks } from "@/types";
import { TaskAnswerForm } from "../forms/task-answer-form";
import { lessonsToRussian } from "@/lib/utils";
import useIsMounted from "@/hooks/use-is-mounted";

interface TaskCardFullProps {
	title: string;
	description: string;
	difficulty: number;
	points: number;
	lesson: Lessons;
	author: Profile;
	taskImages: string[];
	id: string;
	profile: ProfileWithTasks;
	solution?: string;
	solutionImages?: string[];
	answer?: string;
}

export const TaskCardFull = ({
	title,
	description,
	difficulty,
	points,
	lesson,
	author,
	id,
	profile,
	taskImages,
	solution,
	solutionImages,
	answer,
}: TaskCardFullProps) => {
	const isMounted = useIsMounted();

	if (!isMounted) {
		return null;
	}

	const completed = profile.completedTasks.some((task) => task.id === id);
	const created = author.id === profile.id;
	const failed = profile.incorrectTasks.some((task) => task.id === id);
	const isTaskNew = !completed && !created && !failed;

	return (
		<Card className="bg-zinc-100 dark:bg-[#1e1f21] min-h-[75%] m-5 p-5">
			{completed && (
				<span className="text-emerald-400 relative left-6">
					Вы уже прошли эту задачу!
				</span>
			)}
			{created && (
				<span className="text-slate-500 relative left-6">
					Вы создатель этой задачи
				</span>
			)}
			{failed && (
				<span className="text-rose-500 relative left-6">
					Вы не решили эту задачу
				</span>
			)}
			<CardHeader>
				<CardTitle className="mb-1">
					<div className="flex justify-between gap-2">
						<div className="flex gap-3">
							<span className="">{title}</span>
							<span className="text-[20px] font-thin">
								{lessonsToRussian(lesson)}
							</span>
						</div>
						<ActionTooltip
							label={author.email}
							align="end"
							capitalize={false}
						>
							<span className="text-s font-thin dark:text-[#a59aa5] capitalize">
								{author.name}
							</span>
						</ActionTooltip>
					</div>
				</CardTitle>
				<CardDescription className="text-wrap max-w-full h-full text-[24px]">
					<p>{description}</p>
					<div className="flex gap-3 mt-2">
						{taskImages.map((image) => (
							<Link target="_blank" href={image} key={image}>
								<Image
									src={image}
									width={96}
									height={96}
									alt={"taskImage"}
								/>
							</Link>
						))}
					</div>
				</CardDescription>
				<CardContent className="p-0 flex justify-between">
					<span className="pr text-[24px] font-semibold">
						Очков: {points}
					</span>
					<span className="text-[24px]">
						Сложность:
						<span
							style={{
								color: `#${Math.floor(
									(255 / 10) * difficulty
								).toString(16)}5577`,
							}}
						>
							{difficulty}
						</span>
						/10
					</span>
				</CardContent>
				<CardFooter>
					{isTaskNew && <TaskAnswerForm taskId={id} />}
					{!isTaskNew && (
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="item-1">
								<AccordionTrigger>
									Посмотреть решение
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									<p>{solution}</p>
									<div className="flex gap-3 mt-2">
										{solutionImages?.map((image) => (
											<Link
												target="_blank"
												href={image}
												key={image}
											>
												<Image
													src={image}
													width={96}
													height={96}
													alt={"taskImage"}
												/>
											</Link>
										))}
									</div>
                  <h3 className="text-[18px]">Ответ: {answer}</h3>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					)}
				</CardFooter>
			</CardHeader>
		</Card>
	);
};

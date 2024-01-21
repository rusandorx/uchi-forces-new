"use client";

import { TaskCard } from "./task-card";
import { TaskWithStatus } from "@/types";

interface TaskListProps {
	tasks: TaskWithStatus[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
	return (
		<>
			<ul className="grid lg:grid-cols-3  md:grid-cols-2 grid-rows-3 gap-1 p-2">
				{tasks.map((task) => (
					<TaskCard key={task.id} {...task} />
				))}
			</ul>
		</>
	);
};

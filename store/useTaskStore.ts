import { defineStore } from "pinia";
import { ColumnId, Task, TaskId } from "../types";
import { useColumnStore } from "./useColumnStore";

// temp
const mockTasks: Task[] = [
	{
		id: "0ac8b1ee-315c-4d1c-b223-f799dcdd3task1",
		name: "Task 1",
		description: "Task 1 Description",
		order: 0,
		columnId: "0ac8b1ee-315c-4d1c-b223-f799dcdd3ba1",
	},
	{
		id: "0ac8b1ee-315c-4d1c-b223-f799dcdd3task2",
		name: "Task 2",
		description: "Task 2 Description",
		order: 1,
		columnId: "0ac8b1ee-315c-4d1c-b223-f799dcdd3ba1",
	},
	{
		id: "0ac8b1ee-315c-4d1c-b223-f799dcdd3task3",
		name: "Task 3",
		description: "",
		order: 1,
		columnId: "0ac8b1ee-315c-4d1c-b223-f799dcdd3ba2",
	},
];

export const useTaskStore = defineStore("taskStore", () => {
	const tasks = ref<Task[]>(mockTasks ?? []);
	const selectedTaskId = ref<TaskId | null>(null);

	const columnStore = useColumnStore();
	const { getColumn } = columnStore;

	const selectedTask = computed(() => {
		return getTask(selectedTaskId.value);
	});

	const selectedTaskColumn = computed(() => {
		return getColumn(selectedTask?.value?.columnId);
	});

	const selectTask = (taskId: TaskId | null) => {
		selectedTaskId.value = taskId;
	};

	const getTask = (taskId: TaskId | null): Task | null => {
		if (!taskId) return null;

		const task = tasks.value.find((v) => v.id === taskId) ?? null;

		return task;
	};

	const getTasksByColumnId = (columnId: ColumnId) => {
		return tasks.value.filter((v) => v.columnId === columnId);
	};

	const createTask = (task: Task) => {
		tasks.value.push(task);
	};

	const editTask = (taskId: TaskId, updatedTask: Task) => {
		tasks.value = tasks.value.map((task) => {
			if (task.id === taskId) {
				return {
					...task,
					...updatedTask,
				};
			}

			return task;
		});
	};

	const deleteTask = () => {
		console.log("delete");
	};

	return {
		tasks,
		selectedTaskId,
		selectedTask,
		selectedTaskColumn,
		getTask,
		createTask,
		editTask,
		deleteTask,
		getTasksByColumnId,
		selectTask,
	};
});

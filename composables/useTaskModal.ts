import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { TaskModalEvent } from "~/constants/modal";
import { MAX_TASKS, MIN_TASKS } from "~/constants/task";
import { ValidationStatus } from "~/constants/validation";
import { useBoardStore } from "~/store/useBoardStore";
import { useColumnStore } from "~/store/useColumnStore";
import { useSubtaskStore } from "~/store/useSubtaskStore";
import { useTaskStore } from "~/store/useTaskStore";
import { ColumnId, Subtask, SubtaskId, Task } from "~/types";
import { TaskModalSubtask } from "~/types/modal";
import { getInitSubtaskData } from "~/utils/subtask";
import { getInitTaskData } from "~/utils/task";

interface Props {
	event: TaskModalEvent;
	onClose: () => void;
}

export const useTaskModal = ({ event, onClose }: Props) => {
	const toast = useToast();

	const boardStore = useBoardStore();
	const { selectedBoardId } = storeToRefs(boardStore);

	const columnStore = useColumnStore();
	const { getColumnsByBoardId } = columnStore;

	const columns = computed(() => getColumnsByBoardId(selectedBoardId.value));

	const taskStore = useTaskStore();
	const { selectedTask, selectedTaskId } = storeToRefs(taskStore);
	const { createTask, getTasksByColumnId, editTask } = taskStore;

	const columnTasksCount = computed(
		() => getTasksByColumnId(columns.value[0].id!).length,
	);

	const subtaskStore = useSubtaskStore();
	const { addSubtasks, getSubtasksByTaskId, editSubtasksByTaskId } =
		subtaskStore;

	const task =
		event === TaskModalEvent.TaskAdd
			? getInitTaskData(columns.value[0].id, columnTasksCount.value)
			: { ...selectedTask.value! };
	const taskData = reactive<Task>(task);

	const subtasks =
		event === TaskModalEvent.TaskAdd
			? [getInitSubtaskData(taskData.id)]
			: getSubtasksByTaskId(selectedTaskId.value!).map((v) => ({
					...v,
					validationStatus: ValidationStatus.Idle,
			  }));

	const subtasksData = ref<TaskModalSubtask[]>(subtasks);

	const taskNameValidationStatus = ref<ValidationStatus>(ValidationStatus.Idle);

	const validate = () => {
		taskNameValidationStatus.value = isEmpty(taskData.name)
			? ValidationStatus.Invalid
			: ValidationStatus.Idle;

		subtasksData.value = subtasksData.value.map((v) => {
			const result = { ...v } as TaskModalSubtask;

			if (isEmpty(v.name)) {
				result.validationStatus = ValidationStatus.Invalid;

				return result;
			}

			return result;
		});
	};

	const isInvalid = () => {
		const validationStatuses = [
			taskNameValidationStatus.value,
			...subtasksData.value.map((v) => v.validationStatus),
		];

		return isValidationInvalid(validationStatuses);
	};

	const submit = () => {
		validate();

		if (isInvalid()) {
			toast.error("Invalid form data. Please check your input and try again");
			return;
		}

		const subtasks = subtasksData.value
			.filter((v) => !isEmpty(v.name))
			.map(({ validationStatus: _, ...v }) => ({
				...v,
			})) as Subtask[];

		if (event === TaskModalEvent.TaskAdd) {
			createTask(taskData);
			addSubtasks(subtasks);
			toast.success("Task created");
		}

		if (event === TaskModalEvent.TaskEdit) {
			editTask(selectedTaskId.value!, task);
			editSubtasksByTaskId(selectedTaskId.value!, subtasks);
			toast.success("Task edited");
		}

		onClose();
	};

	const updateName = (name: string) => {
		if (taskNameValidationStatus.value === ValidationStatus.Invalid) {
			taskNameValidationStatus.value = ValidationStatus.Idle;
		}

		taskData.name = name;
	};
	const updateDescription = (description: string) =>
		(taskData.description = description);

	const updateColumn = (columnId: ColumnId) => {
		const columnTasksCount = getTasksByColumnId(columnId).length;

		taskData.columnId = columnId;
		taskData.order = columnTasksCount;
	};

	const addSubtask = () => {
		if (subtasksData.value.length >= MAX_TASKS) return;

		const subtaskData = getInitSubtaskData(taskData.id);
		subtasksData.value.push(subtaskData);
	};

	const updateSubtask = (itemId: SubtaskId, name: string) => {
		subtasksData.value = subtasksData.value.map((subtask) => {
			if (subtask.id === itemId) {
				return {
					...subtask,
					name,
					validationStatus: ValidationStatus.Idle,
				};
			}

			return subtask;
		});
	};

	const removeSubtask = (id: SubtaskId) => {
		if (subtasksData.value.length <= MIN_TASKS) return;

		subtasksData.value = subtasksData.value.filter(
			(subtask) => subtask.id !== id,
		);
	};

	return {
		task: taskData,
		subtasks: subtasksData,
		columns,
		taskNameValidationStatus,
		submit,
		updateName,
		updateDescription,
		addSubtask,
		updateSubtask,
		removeSubtask,
		updateColumn,
	};
};

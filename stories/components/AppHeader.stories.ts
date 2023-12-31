import type { Meta, StoryObj } from "@storybook/vue3";
import AppHeader from "~/components/AppHeader/AppHeader.vue";
import { Board } from "~/types";

const boards: Board[] = [
	{
		id: "1",
		name: "Board 1",
		columns: [],
	},
	{
		id: "2",
		name: "Board 2",
		columns: [],
	},
	{
		id: "3",
		name: "Board 3",
		columns: [],
	},
	{
		id: "4",
		name: "Board 4",
		columns: [],
	},
	{
		id: "5",
		name: "Board 5",
		columns: [],
	},
];

const boardWithLongName: Board = {
	id: "1",
	name: "Platform Launch Platform Launch Platform Launch Platform Launch Platform Launch",
	columns: [],
};

const meta = {
	title: "UI/AppHeader",
	component: AppHeader,
	render: (args: any) => ({
		components: { AppHeader },
		setup() {
			return { args };
		},
		template: '<AppHeader  v-bind="args" />',
	}),
	args: {
		boards,
		selectedBoard: boards[0],
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
	args: {},
};

export const LongBoardName: Story = {
	args: {
		selectedBoard: boardWithLongName,
	},
};

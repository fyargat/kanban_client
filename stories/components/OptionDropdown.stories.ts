import type { Meta, StoryObj } from "@storybook/vue3";
import OptionDropdown from "~/components/OptionDropdown/OptionDropdown.vue";

const meta = {
	title: "UI/OptionDropdown",
	component: OptionDropdown,
	render: (args: any) => ({
		components: { OptionDropdown },
		setup() {
			return { args };
		},
		template: '<OptionDropdown  v-bind="args" />',
	}),

	args: {
		editText: "Edit Board",
		deleteText: "Delete Board",
	},

	decorators: [
		() => ({
			template:
				'<div style="display: flex;"><div style="margin-left: auto;" ><story/></div></div>',
		}),
	],
} satisfies Meta<typeof OptionDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};

import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/vue3";
import RemovableInputField from "~/components/RemovableInputField/RemovableInputField.vue";

const meta = {
	title: "UI/RemovableInputField",
	component: RemovableInputField,
	decorators: [
		() => ({ template: '<div style="maxWidth: 400px"><story/></div>' }),
	],
	render: (args: any) => ({
		components: { RemovableInputField },
		setup() {
			const value = ref<string>(args.modelValue ?? "");

			return { isDisabled: args.isDisabled, onRemove: args.onRemove, value };
		},
		template:
			'<RemovableInputField :isDisabled="isDisabled" :onRemove="onRemove" :modelValue="value" />',
	}),
	args: {
		modelValue: "",
		onRemove: action("remove"),
	},
} satisfies Meta<typeof RemovableInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
	args: {},
};

export const Disabled: Story = {
	args: {
		isDisabled: true,
	},
};
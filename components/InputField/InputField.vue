<template>
	<div class="input-field__container">
		<label>
			<p v-if="label" class="input-field__label">{{ label }}</p>

			<div class="input-field__input-container">
				<input
					:disabled="disabled"
					class="input-field__input"
					type="text"
					:value="modelValue"
					@input="updateInputValue"
				/>
				<span
					v-if="INVALID_STATUSES.includes(validationStatus)"
					class="input-field__error-text"
				>
					{{ errorText ?? "Required" }}
				</span>
			</div>
		</label>
	</div>
</template>

<script setup lang="ts">
import { INVALID_STATUSES, ValidationStatus } from "~/constants/validation";

interface Props {
	modelValue: string;
	disabled?: boolean;
	label?: string;
	validationStatus?: ValidationStatus;
}

const emit = defineEmits(["update:modelValue"]);

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	label: "",
	validationStatus: ValidationStatus.Idle,
});

const errorText = computed(() => {
	if (props.validationStatus === ValidationStatus.Used) {
		return "Used";
	}

	return "Required";
});

const updateInputValue = (event: Event) => {
	const { value } = event.target as HTMLInputElement;

	emit("update:modelValue", value);
};
</script>

<style scoped lang="scss">
@use "./InputField.scss";
</style>

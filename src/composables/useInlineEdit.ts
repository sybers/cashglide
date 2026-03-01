import { ref, nextTick } from "vue";
import type { Ref } from "vue";

export function useInlineEdit<T>(
  inputRef: Ref<HTMLInputElement | null>,
  getValue: () => T,
  onSave: (value: T) => void,
) {
  const isEditing = ref(false);
  const editValue = ref(getValue()) as Ref<T>;

  async function startEdit() {
    editValue.value = getValue();
    isEditing.value = true;
    await nextTick();
    inputRef.value?.focus();
    inputRef.value?.select();
  }

  function save() {
    onSave(editValue.value);
    isEditing.value = false;
  }

  function cancel() {
    editValue.value = getValue();
    isEditing.value = false;
  }

  return { isEditing, editValue, inputRef, startEdit, save, cancel };
}

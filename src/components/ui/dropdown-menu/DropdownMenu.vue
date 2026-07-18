<script setup>
import { DropdownMenuRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps()
const emits = defineEmits()

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>

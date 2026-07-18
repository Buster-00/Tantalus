<script setup>
import { DropdownMenuSub, useForwardPropsEmits } from "reka-ui";

const props = defineProps()
const emits = defineEmits()

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DropdownMenuSub v-bind="forwarded">
    <slot />
  </DropdownMenuSub>
</template>

<script setup>
import { DropdownMenuGroup } from "reka-ui";

const props = defineProps()
</script>

<template>
  <DropdownMenuGroup v-bind="props">
    <slot />
  </DropdownMenuGroup>
</template>

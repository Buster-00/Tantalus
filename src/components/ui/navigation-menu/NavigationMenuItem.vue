<script setup>
import { NavigationMenuItem } from "reka-ui";

const props = defineProps()
</script>

<template>
  <NavigationMenuItem v-bind="props">
    <slot />
  </NavigationMenuItem>
</template>

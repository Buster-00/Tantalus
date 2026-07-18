<script setup>
import { NavigationMenuLink, useForwardPropsEmits } from "reka-ui";

const props = defineProps()
const emits = defineEmits()

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <NavigationMenuLink v-bind="forwarded">
    <slot />
  </NavigationMenuLink>
</template>

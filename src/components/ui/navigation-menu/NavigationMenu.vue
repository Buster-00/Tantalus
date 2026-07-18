<script setup>
import { reactiveOmit } from "@vueuse/core";
import { NavigationMenuRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";
import NavigationMenuViewport from "./NavigationMenuViewport.vue";

const props = defineProps()

const emits = defineEmits()

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <NavigationMenuRoot
    v-bind="forwarded"
    :class="
      cn(
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
        props.class,
      )
    "
  >
    <slot />
    <NavigationMenuViewport />
  </NavigationMenuRoot>
</template>

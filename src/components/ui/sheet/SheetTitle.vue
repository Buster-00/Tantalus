<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DialogTitle } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps()

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DialogTitle
    :class="cn('text-lg font-semibold text-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>

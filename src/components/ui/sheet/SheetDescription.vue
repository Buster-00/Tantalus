<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DialogDescription } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps()

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DialogDescription
    :class="cn('text-sm text-muted-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>

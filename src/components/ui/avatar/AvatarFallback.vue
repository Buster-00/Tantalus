<script setup>
import { AvatarFallback } from 'reka-ui'

const props = defineProps()
</script>

<template>
  <AvatarFallback v-bind="props">
    <slot />
  </AvatarFallback>
</template>

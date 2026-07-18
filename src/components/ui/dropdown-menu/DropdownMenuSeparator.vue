<script setup>
import { Separator } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: [String, Object, Array], default: '' },
})
</script>

<template>
  <Separator :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>

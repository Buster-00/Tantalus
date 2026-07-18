<script setup>
import { reactiveOmit } from '@vueuse/core'
import { Separator as SeparatorRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  orientation: { type: String, default: 'horizontal' },
  decorative: { type: Boolean, default: true },
  class: { type: [String, Object, Array], default: '' },
})

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <SeparatorRoot
    v-bind="delegatedProps"
    :class="cn('shrink-0 bg-border', props.orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full', props.class)"
  />
</template>

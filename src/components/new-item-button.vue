<template>

  <v-btn
	  color="primary"
	  small
	  elevation="2"
	  class="my-5"
	  block
  >
	<slot></slot>
  </v-btn>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend( {
	name : 'new-item-button'
} )
</script>

<style lang="scss" scoped></style>
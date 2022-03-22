<template>
  <div class="progress-wrapper" v-if="active">
	<v-progress-circular
		class="progress"
		indeterminate
		color="primary"
		width="3"
		size="50"
	></v-progress-circular>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend( {
	name : 'loader',

	props : {
		active : Boolean
	}
} )

</script>

<style lang="scss" scoped>

.progress-wrapper {

  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .3);

  z-index: 9999;

  .progress {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
  }

}

</style>
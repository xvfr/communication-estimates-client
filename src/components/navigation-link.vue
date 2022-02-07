<template>

  <router-link
	  :to="link"
	  custom
	  v-slot="{ href, route, navigate, isActive, isExactActive }">

	<v-btn
		@click="navigate"
		plain
		small
		:class="{ 'primary--text' : isExactActive }">

	  <slot></slot>

	</v-btn>

  </router-link>

</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend( {
	name : 'navigation-link',

	props : {
		link : String
	}
} )

</script>
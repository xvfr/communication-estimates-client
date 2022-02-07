<template>

  <v-layout fill-height justify-center align-center>

	<v-alert
		type="error"
		prominent
		border="left"
	>
	  <h1 class="display-1">
		<strong>Ошибка!</strong> Страница не найдена!
	  </h1>

	</v-alert>

  </v-layout>

</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend( {
	name : 'not-found'
} )

</script>
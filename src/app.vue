<template>
  <div id="app">
	<v-app>

	  <v-app-bar dense app>

		<v-app-bar-nav-icon class="d-md-none"></v-app-bar-nav-icon>
		<v-app-bar-title>% app name %</v-app-bar-title>

		<nav class="navigation d-none d-md-block pl-4">
		  <navigation-link v-for="route in routes" :key="route.link" :link="route.link">{{ route.text }}</navigation-link>
		</nav>

	  </v-app-bar>

	  <v-main app>
		<router-view/>
	  </v-main>

	</v-app>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import navigationLink from '@/components/navigation-link.vue'

export default Vue.extend( {
	name : 'app',

	components : {
		navigationLink
	},

	data : () => ( {

		routes : [
			{
				text : 'Авторизация',
				link : '/login'
			},
			{
				text : 'Подрядчики',
				link : '/about'
			},
			{
				text : 'Исполнители',
				link : '/about'
			},
			{
				text : 'Заказчики',
				link : '/about'
			},
			{
				text : 'Home',
				link : '/'
			},
			{
				text : 'Vuetify',
				link : '/test'
			},
			{
				text : 'About',
				link : '/about'
			}
		]

	} )

} )

</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>

<template>
  <div id="app">
	<v-app>

	  <v-app-bar dense app>

		<v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
		<v-app-bar-title>% app name %</v-app-bar-title>

		<nav class="navigation hidden-md-and-down pl-4">
		  <navigation-link v-for="route in routes" :key="route.link" :link="route.link">{{
			  route.placeholder
			}}
		  </navigation-link>
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

interface iNavigationLink {
	placeholder? : string,
	link : string,
}

export default Vue.extend( {
	name : 'app',

	components : {
		navigationLink
	},

	data : () => ( {
		routes : [] as Array<iNavigationLink>
	} ),

	created () {
		this.routes = this.$router.getRoutes().filter( rt =>
			( rt.meta.requiredAuth === undefined
				|| rt.meta.requiredAuth === this.$store.state.isAuthorized
			) && rt.meta.isNavigationLink
		).map( rt => ( {
			placeholder : rt.name,
			link : rt.path || '/'
		} ) )
	}

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

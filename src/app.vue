<template>
  <div id="app">
	<v-app>

	  <v-app-bar dense app>

		<v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
		<v-app-bar-title>communication-estimates</v-app-bar-title>

		<nav class="navigation hidden-md-and-down pl-4">
		  <navigation-link v-for="route in routes" :key="route.link" :link="route.link">{{
			  route.placeholder
			}}
		  </navigation-link>
		</nav>

		<v-btn v-if="isAuthorized" @click="logout" class="logout" plain small>Выйти</v-btn>

	  </v-app-bar>

	  <v-main app>

		<v-snackbar
			v-model="$store.state.error.active"
			:timeout="5000"
			shaped
			color="error"
		>
		  <div class="text-center">
			<b>Ошибка!</b> {{ $store.state.error.text }}
		  </div>
		</v-snackbar>

		<router-view />
	  </v-main>

	</v-app>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import navigationLink from '@/components/navigation-link.vue'
import api from '@/api'

interface iNavigationLink {
	placeholder? : string,
	link : string,
}

export default Vue.extend( {
	name : 'app',

	components : {
		navigationLink
	},

	data () {
		return {

			routes : [] as Array<iNavigationLink>,

			error : false,
			errorText : '',

		}
	},

	created () {
		this.renderNavigation()

		api.defaults.headers.common[ 'Authorization' ] = this.$store.state.user.token
	},

	computed : {

		isAuthorized () {
			this.renderNavigation()
			return this.$store.getters.isAuthorized
		}

	},

	methods : {

		logout () {
			this.$store.dispatch( 'logout' )
		},

		processError ( message : string ) {
			this.error = true
			this.errorText = message
		},

		renderNavigation () {
			this.routes = this.$router.getRoutes().filter( rt =>
				( rt.meta.requiredAuth === undefined
					|| rt.meta.requiredAuth === this.$store.getters.isAuthorized
				) && rt.meta.isNavigationLink
			).map( rt => ( {
				placeholder : rt.name,
				link : rt.path || '/'
			} ) )
		}

	}

} )

</script>

<style lang="scss">

//::-webkit-scrollbar {
//  width: .8em;
//}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logout {
  position: absolute;
  right: 5px;
}

</style>

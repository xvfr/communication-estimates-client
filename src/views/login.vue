<template>

  <v-layout justify-center align-center fill-height>
	<v-flex sm7 md5 lg3 class="px-5">

	  <v-card
		  class="text-center"
		  elevation="2"
		  outlined
		  shaped>

		<loader :active="loading"></loader>

		<v-alert
			v-if="error"
			class="mt-5 mb-0 mx-5"
			dense
			outlined
			shaped
			type="error"
		>
		  <b>Ошибка!</b> {{ error }}
		</v-alert>

		<v-card-title class="d-block">
		  <h2 class="display-1">Авторизация</h2>
		</v-card-title>

		<v-card-text>

		  <v-form
			  v-model="valid">

			<v-text-field
				label="Логин или e-mail"
				v-model="login"
				required
				:rules="loginRules"
			/>
			<v-text-field
				label="Пароль"
				v-model="password"
				required
				:rules="passwordRules"
				type="password"
			/>

			<v-btn
				@click="auth"
				color="primary"
				outlined
				:disabled="!valid"
			>
			  Авторизоваться
			</v-btn>

		  </v-form>

		</v-card-text>

	  </v-card>

	</v-flex>
  </v-layout>

</template>

<script lang="ts">
import Vue from 'vue'
import loader from '@/components/loader.vue'

export default Vue.extend( {

	name : 'login',
	components : {
		loader
	},

	data : () => ( {
		loading : false,

		error : '',

		valid : false,

		login : '',
		loginRules : [
			( login : string ) => !!login || 'Введите логин!',
			( login : string ) => login.length > 2 || 'Слишком короткий логин!'
		],

		password : '',
		passwordRules : [
			( password : string ) => !!password || 'Введите пароль!'
		]
	} ),

	methods : {

		async auth () {

			this.loading = true
			this.error = ''

			try {

				await this.$store.dispatch( 'login', {
					username : this.login,
					password : this.password
				} )

			} catch ( e ) {
				this.error = e.response.data.error
			}

			setTimeout( () => {

				this.loading = false

			}, 2000 )

		}

	},

} )
</script>

<style lang="scss">

.progress-wrapper {

  position: absolute;
  width: 100%;
  height: 100.5%;
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
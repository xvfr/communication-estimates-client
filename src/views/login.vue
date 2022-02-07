<template>

  <v-layout justify-center align-center fill-height>
	<v-flex sm7 md5 lg3 class="px-5">

	  <v-card
		  class="text-center"
		  elevation="2"
		  outlined
		  shaped>

		<v-alert
			class="mt-5 mb-0 mx-5"
			dense
			outlined
			shaped
			type="error"
		>
		  <b>Ошибка!</b> % error message %
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

export default Vue.extend( {
	name : 'login',

	data : () => ( {
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

	} )
} )

</script>
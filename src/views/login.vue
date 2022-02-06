<template>

  <v-layout justify-center align-center fill-height>
	<v-flex sm7 md3 class="px-5">

	  <v-card
		  class="pb-5 px-5 text-center"
		  elevation="2"
		  outlined
		  shaped>

		 <v-alert
			class="mt-5 mb-0"
			color="error"
			dense
			outlined
			shaped
		>
		  <b>Ошибка!</b> % error message %
		</v-alert>

		<v-card-title>Авторизация</v-card-title>

		<v-form
			v-model="valid">

		  <v-text-field
			  label="Логин"
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
			  :disabled="!valid"
		  >
			Авторизоваться
		  </v-btn>

		</v-form>
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

<style lang="scss" scoped></style>
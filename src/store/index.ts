import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import router from '@/router'

Vue.use( Vuex )

export default new Vuex.Store( {

	state : {

		user : {
			isAuthorized : false,
			token : localStorage.getItem( 'token' ) || ''
		}

	},

	getters : {
		isAuthorized : state => state.user.isAuthorized || !!state.user.token
	},

	mutations : {

		login : ( state, token ) => {
			state.user.isAuthorized = true
			state.user.token = token
		},

		logout : state => {
			state.user.isAuthorized = false
			state.user.token = ''
		}

	},

	actions : {

		login : async ( { commit }, payload ) => {

			const user = await api.post( 'user/auth', {
				username : payload.username,
				password : payload.password
			} )

			commit( 'login', user.data.token )
			router.push( '/about' )
			localStorage.setItem( 'token', user.data.token )
		},

		logout : ( { commit } ) => {
			commit( 'logout' )
			router.push( '/login' )
			localStorage.removeItem( 'token' )
		}

	}
} )

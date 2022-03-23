import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

// Components
import Home from '@/views/home.vue'
import Login from '@/views/login.vue'
import Test from '@/views/test.vue'
import NotFound from '@/views/not-found.vue'
import Contracts from '@/views/contracts.vue'
import Amortization from '@/views/amortization.vue'

Vue.use( VueRouter )

const routes : Array<RouteConfig> = [

	{
		path : '/',
		name : 'Главная',
		component : Home,

		meta : {
			requiredAuth : true,
			isNavigationLink : true
		}
	},
	{
		path : '/login',
		name : 'Авторизация',
		component : Login,

		meta : {
			requiredAuth : false,
			isNavigationLink : true
		}
	},
	{
		path : '/contracts',
		name : 'Договоры',
		component : Contracts,

		meta : {
			requiredAuth : true,
			isNavigationLink : true
		}
	},
	{
		path : '/amortization',
		name : 'Амортизация т\\с',
		component : Amortization,

		meta : {
			requiredAuth : true,
			isNavigationLink : true
		}
	},
	{
		path : '/about',
		name : 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component : () => import(/* webpackChunkName: "about" */ '../views/about.vue'),

		meta : {
			isNavigationLink : true
		}
	},
	{
		path : '/test',
		name : 'test',
		component : Test,

		meta : {
			isNavigationLink : true
		}
	},
	{
		path : '*',
		name : 'error page',
		component : NotFound
	}

]

const router = new VueRouter( {
	mode : 'history',
	base : process.env.BASE_URL,
	routes
} )

router.beforeEach( ( to, from, next ) => {

	if ( !to.meta )
		return next()

	const
		requiredAuth = to.meta.requiredAuth,
		isAuthorized = store.getters.isAuthorized

	if ( requiredAuth === undefined )
		return next()

	if ( requiredAuth && !isAuthorized )
		return next( '/login' )

	if ( !requiredAuth && isAuthorized )
		return next( '/' )

	next()

} )

export default router

import axios from 'axios'
import store from '@/store'

// declare let process : {
// 	env : {
// 		API_BASE_URL : string
// 	}
// }

const api = axios.create( {

	baseURL : 'http://localhost:3000/api/',

	headers : {
		'Content-Type' : 'application/json'
	}

} )

api.interceptors.response.use( response => response, error => {

	if ( error.response.status == 401 )
		return store.dispatch( 'logout' )

	store.commit( 'error', error.response?.data?.error )

	throw error

} )

export default api
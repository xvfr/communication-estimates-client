import axios from 'axios'

// declare let process : {
// 	env : {
// 		API_BASE_URL : string
// 	}
// }

const api = axios.create( {

	baseURL : 'http://localhost:3000/api/',

	headers : {
		'Content-Type': 'application/json'
	}

} )

// api.defaults.headers

// api.interceptors.response.use( response => {
//
// 	if ( response.status == 401 )
// 		return store.dispatch( 'logout' )
//
// } )

export default api
<template>
  <div class="about">
	<loader :active="loading"></loader>
	<h1>This is an about page</h1>
  </div>
</template>

<script>
import loader from '@/components/loader'

export default {
	data () {
		return {
			loading : true
		}
	},

	components : { loader },

	mounted () {

		setTimeout( () => {
			this.loading = false
		}, 2000 )

	}

}
</script>
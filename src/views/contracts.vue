<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="6" offset="3">
		<v-data-table
			:headers="headers"
			:items="items"
			:loading="loading"
			loading-text="Загрузка..."
			loader-height="2"
		>
		</v-data-table>
	  </v-col>
	</v-row>
  </v-container>

</template>

<script lang="ts">

import Vue from 'vue'
import api from '@/api'

export default Vue.extend( {
	name : 'contracts',
	components : {},

	data () {
		return {
			loading : true,

			headers : [
				{
					text : '#',
					value : 'name'
				},
				{
					text : 'Дата',
					align : 'end',
					value : 'created_date'
				}
			],

			items : []
		}
	},

	async mounted () {

		try {

			const data = await api.get( 'contracts' )

			setTimeout( () => {
				this.items = data.data.items

				this.loading = false
			}, 2000 )

		} catch ( e ) {
			console.log( e )
		}

	}
} )

</script>

<style lang="scss" scoped>

</style>
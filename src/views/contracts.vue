<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="6" offset="3">

		<v-text-field
			v-model="search"
			append-icon="mdi-magnify"
			label="Поиск"
		></v-text-field>

		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="items"
			:loading="loading"
			loading-text="Загрузка..."
			loader-height="2"
			:items-per-page="15"
			:search="search"
		>

		  <template v-slot:item.name="{ item } ">
			<a :href="`contracts/${item.contract_id}`">{{ item.name }}</a>
		  </template>

		  <template v-slot:item.customers="{ item } ">
			<span v-if="item.customers.length">
			  <a class="item" :href="`customers/${customer.customer_id}`"
				 v-for="customer in item.customers">{{ customer.customer_name }}</a>
			</span>
			<small v-else>нет</small>
		  </template>

		  <template v-slot:item.contractors="{ item } ">
			<span v-if="item.contractors.length">
				<a class="item" :href="`contractors/${contractor.contractor_id}`"
				   v-for="contractor in item.contractors">{{ contractor.contractor_name }}</a>
			</span>
			<small v-else>нет</small>
		  </template>

		  <template v-slot:item.created_date="{ item } ">
			{{ item.created_date | date }}
		  </template>


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
			search : '',

			loading : true,

			headers : [
				{
					text : '#',
					align : 'start',
					value : 'name'
				},
				{
					text : 'Заказчики',
					align : 'center',
					value : 'customers'
				},
				{
					text : 'Подрядчики',
					align : 'center',
					value : 'contractors'
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

	filters : {
		date ( date : string ) {
			return new Date( date ).toLocaleDateString()
		}
	},

	async mounted () {

		try {

			const data = await api.get( 'contracts' )

			setTimeout( () => {

				this.items = data.data.items

				console.log( data.data.items )

				this.loading = false

			}, 2000 )

		} catch ( e ) {
			console.log( e )
		}

	}
} )

</script>

<style lang="scss" scoped>

.item {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:not(:last-child):after {

    content: ', ';
    color: #000;

  }

}

</style>
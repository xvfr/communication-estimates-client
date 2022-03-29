<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="8" offset="2">

		<h1 class="display-1">Договоры</h1>

		<new-item-button class="mb-0 test">Добавить новый договор</new-item-button>

		<v-text-field
			v-if="!loading"
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
			:custom-filter="customFilter"
		>

		  <template v-slot:item.name="{ item } ">
			<a :href="`contracts/${item.contract_id}`">{{ item.name }}</a>
		  </template>

		  <template v-slot:item.customers="{ item } ">
			<span v-if="item.customers.length">
			  <a class="item" :href="`customers?search=${customer.customer_name}`"
				 v-for="customer in item.customers">{{ customer.customer_name }}</a>
			</span>
			<small v-else>нет</small>
		  </template>

		  <template v-slot:item.contractors="{ item } ">
			<span v-if="item.contractors.length">
				<a class="item" :href="`contractors?search=${contractor.contractor_name}`"
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
import newItemButton from '@/components/new-item-button.vue'

export default Vue.extend( {
	name : 'contracts',
	components : {
		newItemButton
	},

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

	async created () {

		try {

			const data = await api.get( 'contracts' )
			this.items = data.data.items
			this.loading = false

		} catch ( e ) {
			console.error( e )
		}

	},

	methods : {
		customFilter ( value : any, search : any, item : any ) {

			if ( !value || !search )
				return true

			return value.includes( search )
				|| new Date( item.created_date ).toLocaleDateString().includes( search.replaceAll( /(\.|\\|,)/g, '/' ) )
				|| !!item.customers.find( ( e : any ) => e.customer_name.toLowerCase().includes( search.toLowerCase() ) )
				|| !!item.contractors.find( ( e : any ) => e.contractor_name.toLowerCase().includes( search.toLowerCase() ) )

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
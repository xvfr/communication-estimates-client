<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="12">

		<h1 class="mb-5">Расчеты амортизации</h1>

		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="items"
			:loading="loading"
			loader-height="2"
			loading-text="Загрузка..."
			hide-default-footer
			mobile-breakpoint="xs"
		>

		  <template v-slot:item.index="{ item }">
			{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.resource="{ item }">
			{{ item.resource | delimiter }} <small>км.</small>
		  </template>

		  <template v-slot:item.purchase_price="{ item }">
			{{ item.purchase_price | delimiter }} <small>руб.</small>
		  </template>

		  <template v-slot:item.capital_repair_cost="{ item }">
			{{ item.capital_repair_cost | delimiter }} <small>руб.</small>
		  </template>

		  <template v-slot:item.total_cost_current_repair="{ item }">
			{{ item.total_cost_current_repair | delimiter }} <small>руб.</small>
		  </template>

		  <template v-slot:item.service_life="{ item }">
			{{ item.service_life | delimiter }} <small>{{
			  declination( item.service_life, [ 'год', 'года', 'лет' ] )
			}}</small>
		  </template>

		  <template v-slot:item.average_yearly_mileage="{ item }">
			{{ item.average_yearly_mileage | delimiter }} <small>км.</small>
		  </template>

		  <template v-slot:item.average_monthly_mileage="{ item }">
			{{ item.average_monthly_mileage | delimiter }} <small>км.</small>
		  </template>

		  <template v-slot:item.current_maintenance_cost="{ item }">
			{{ item.current_maintenance_cost | delimiter }} <small>руб./км.</small>
		  </template>

		  <template v-slot:item.depreciation_price="{ item }">
			{{ item.depreciation_price | delimiter }} <small>руб./км.</small>
		  </template>

		  <template v-slot:item.practical_cost="{ item }">
			{{ item.practical_cost | delimiter }} <small>руб./км.</small>
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="text-decoration-none" :href="`amortizations/${item.depreciation_id}`">
			  {{ item.name }}
			</a>
		  </template>

		</v-data-table>

	  </v-col>
	</v-row>
  </v-container>

</template>

<script lang="ts">

import Vue from 'vue'
import api from '@/api'
import loader from '@/components/loader.vue'

export default Vue.extend( {

	name : 'amortization',

	data () {
		return {

			loading : true,

			headers : [
				{
					text : '#',
					value : 'index'
				},
				{
					text : 'Автомобиль',
					value : 'name'
				},
				{
					text : 'Ресурс пробега',
					align : 'center',
					value : 'resource'
				},
				{
					text : 'Стоимость покупки',
					align : 'center',
					value : 'purchase_price'
				},
				{
					text : 'Стоимость кап. ремонта)',
					align : 'center',
					value : 'capital_repair_cost'
				},
				{
					text : 'Суммарная стоимость текущего ремонта',
					align : 'center',
					value : 'total_cost_current_repair'
				},
				{
					text : 'Срок эксплуатации',
					align : 'center',
					value : 'service_life'
				},
				{
					text : 'Среднегодовой пробег',
					align : 'center',
					value : 'average_yearly_mileage'
				},
				{
					text : 'Среднемесячный пробег',
					align : 'center',
					value : 'average_monthly_mileage'
				},
				{
					text : 'Стоимость текущего ремонта и ТО',
					align : 'center',
					value : 'current_maintenance_cost'
				},
				{
					text : 'Практическая стоимость',
					align : 'center',
					value : 'practical_cost'
				},
				{
					text : 'Амортизация',
					align : 'center',
					value : 'depreciation_price'
				}
			],

			items : []

		}
	},

	async mounted () {

		try {

			const data = await api.get( 'amortizations' )
			this.items = data.data.items

			this.loading = false

		} catch ( e ) {
			console.log( e )
		}

	},

	methods : {

		declination ( number : number, titles : string[] ) {
			const cases = [ 2, 0, 1, 1, 1, 2 ]
			return titles[ ( number % 100 > 4 && number % 100 < 20 ) ? 2 : cases[ ( number % 10 < 5 ) ? number % 10 : 5 ] ]
		}

	},

	filters : {
		delimiter ( value : string ) {
			return value.toLocaleString()
		}
	}

} )

</script>

<style lang="scss" scoped>

</style>
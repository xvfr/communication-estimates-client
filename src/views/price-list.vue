<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="8" offset="2">

		<h1 class="display-1">Прайс Лист</h1>

		<new-item-button>Добавить новый элемент</new-item-button>

		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="items"
			:loading="loading"
			loading-text="Загрузка..."
			loader-height="2"
			no-data-text="Нет сохраненных элементов"
			:items-per-page="-1"
		>

		  <template v-slot:item.index="{ item }">
			<a :href="`/price-list/${item.price_id}`">{{ items.indexOf( item ) + 1 }}</a>
		  </template>

		  <template v-slot:item.price="{ item }">
			<span v-if="item.price">
			  {{ item.price | delimiter }} <small>руб.</small>
			</span>
			<small v-else>не установлена</small>
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
	name : 'price-list',
	components : {
		newItemButton
	},

	data () {
		return {

			loading : false,

			headers : [
				{
					text : '#',
					align : 'start',
					value : 'index'
				},
				{
					text : 'Наименование',
					value : 'title'
				},
				{
					text : 'Цена',
					align : 'end',
					value : 'price'
				}
			],

			items : []

		}
	},

	async created () {

		try {

			const data = await api.get( 'price-list' )
			this.items = data.data.items
			this.loading = false

		} catch ( e ) {
			console.log( e )
		}

	},

	filters : {
		delimiter ( value : number ) {
			return value.toLocaleString()
		}
	}

} )
</script>

<style lang="scss" scoped></style>
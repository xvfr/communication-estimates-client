<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="6" offset="3">

		<h1 class="display-1">Заказчики</h1>

		<new-item-button>Добавить нового заказчика</new-item-button>

		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="items"
			:loading="loading"
			loading-text="Загрузка..."
			loader-height="2"
			no-data-text="Нет сохраненных заказчиков"
			:items-per-page="15"
		>

		  <template v-slot:item.index="{ item }">
			{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="item" :href="`customers/${item.customer_id}`">{{ item.name }}</a>
		  </template>

		</v-data-table>

	  </v-col>
	</v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import newItemButton from '@/components/new-item-button.vue'
import api from '@/api'

export default Vue.extend( {
	name : 'customers',
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
					align : 'center',
					value : 'name'
				},
				{
					text : 'Количество договоров',
					align : 'end',
					value : 'contracts_count'
				}
			],
			items : []

		}
	},

	async created () {

		try {

			const data = await api.get( 'customers' )
			this.items = data.data.items

			this.loading = false

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

}

</style>
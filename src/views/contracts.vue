<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="8" offset="2">

		<h1 class="display-1">Договоры</h1>

		<new-item-button @click.native="createItem">Добавить новый договор</new-item-button>

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
			no-data-text="Нет сохраненных договоров"
			no-results-text="Не найдено ни одного подходящего элемента"
		>

		  <template v-slot:item.name="{ item } ">
			<a class="text-decoration-none" :href="`contracts?search=${item.name}`">{{ item.name }}</a>
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

		  <template v-slot:item.actions="{ item }">
			<v-icon small @click="editItem(item[id])" class="mr-2">mdi-pencil</v-icon>
			<v-icon small @click="deleteItem(item[id])">mdi-delete</v-icon>
		  </template>

		</v-data-table>

		<!-- modal dialogs -->

		<edit-item-dialog @confirm="saveItemConfirm" :dialogEdit.sync="dialogEdit" :rules="rules" :target="target"
						  :loading="loading">

		  <template v-slot:header v-if="target">
			{{ target[ id ] ? 'Редактирование' : 'Создание' }}
		  </template>

		  <template v-if="target">
			<v-row>
			  <v-col>
				<v-text-field
					v-model="target.name"
					label="Наименование"
					counter="75"
					:rules="[rules.required]"
				/>
			  </v-col>
			</v-row>
			<v-row>
			  <v-col>
				<v-autocomplete
					v-model="target.customers"
					auto-select-first
					clearable
					multiple
					:items="customers"
					item-value="customer_id"
					item-text="name"
					label="Заказчик"
					no-data-text="Нет сохраненных заказчиков"
				></v-autocomplete>
			  </v-col>
			  <v-col>
				<v-autocomplete
					v-model="target.contractors"
					auto-select-first
					clearable
					multiple
					:items="contractors"
					item-value="contractor_id"
					item-text="name"
					label="Подрядчик"
					no-data-text="Нет сохраненных подрядчиков"
				></v-autocomplete>
			  </v-col>
			</v-row>
			<v-row>
			  <v-col>
				<v-text-field
					v-model="target.created_date"
					label="Дата заключения договора"
					type="date"
					clearable
					:rules="[rules.required]"
				/>
			  </v-col>
			</v-row>
		  </template>

		</edit-item-dialog>

		<delete-item-dialog @confirm="deleteItemConfirm" :dialogDelete.sync="dialogDelete" :loading="loading" />

	  </v-col>
	</v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import crudDialogMixin from '@/components/crud-dialog-mixin'
import api from '@/api'

export default Vue.extend( {

	name : 'contracts',
	mixins : [ crudDialogMixin ],

	data () {
		return {
			search : '',
			loading : true,

			customers : [],
			contractors : [],

			id : 'contract_id',
			baseUrl : 'contracts',
			defaultTarget : {
				contract_id : 0,
				name : '',
				contracts_count : 0,
				customers : [],
				contractors : []
			},

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
				},
				{
					text : 'Действия',
					align : 'end',
					value : 'actions',
					sortable : false,
					filterable : false
				}
			],

			rules : {
				required : ( val : string ) => !!val?.length && !!val || 'Обязательное поле'
			}

		}
	},

	filters : {
		date ( date : string ) {
			return new Date( date ).toLocaleDateString()
		}
	},

	created () {

		;( async () => {
			const customers = await api.get( 'customers' )
			this.customers = customers.data.items
		} )()

		;( async () => {
			const contractors = await api.get( 'contractors' )
			this.contractors = contractors.data.items
		} )()

	},

	mounted () {
		if ( this.$route.query.search )
			this.search = String( this.$route.query.search )
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
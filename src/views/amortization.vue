<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="12">

		<h1 class="display-1">Расчеты амортизации</h1>

		<new-item-button @click.native="createItem">Добавить новый расчет</new-item-button>

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
			loader-height="2"
			loading-text="Загрузка..."
			hide-default-footer
			mobile-breakpoint="xs"
			no-results-text="Не найдено ни одного подходящего элемента"
			:search="search"
			no-data-text="Нет сохраненных расчетов"
		>

		  <template v-slot:item.index="{ item }">
			#{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="text-decoration-none" :href="`amortizations?search=${item.name}`">
			  {{ item.name }}
			</a>
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
			  <v-col cols="6">
				<v-text-field
					v-model="target.name"
					label="Наименование"
					counter="50"
					:rules="[rules.required]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.resource"
					label="Ресурс"
					counter="8"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.purchase_price"
					label="Стоимость покупки"
					counter="8"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			</v-row>
			<v-row>
			  <v-col>
				<v-text-field
					v-model="target.capital_repair_cost"
					label="Стоимость кап. ремонта"
					counter="8"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.total_cost_current_repair"
					label="Суммарная стоимость текущего ремонта"
					counter="11"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.service_life"
					label="Срок эксплуатации"
					counter="3"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.average_yearly_mileage"
					label="Среднегодовой пробег"
					counter="10"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			</v-row>
			<v-row>
			  <v-col>
				<v-text-field
					v-model="target.average_monthly_mileage"
					label="Среднемесячный пробег"
					counter="8"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.current_maintenance_cost"
					label="Стоимость текущего ремонта и ТО"
					counter="5"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.practical_cost"
					label="Практическая стоимость"
					counter="8"
					:rules="[rules.required, rules.number, rules.positive]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.depreciation_price"
					label="Амортизация"
					counter="10"
					:rules="[rules.required, rules.number]"
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
import api from '@/api'
import newItemButton from '@/components/new-item-button.vue'
import deleteItemDialog from '@/components/delete-item-dialog.vue'
import editItemDialog from '@/components/edit-item-dialog.vue'

const baseUrl = 'amortizations'
const id = 'depreciation_id'

interface Item {
	[ id ] : number,
	name : string,
	resource : number | null,
	purchase_price : number | null,
	capital_repair_cost : number | null,
	total_cost_current_repair : number | null,
	service_life : number | null,
	average_yearly_mileage : number | null,
	average_monthly_mileage : number | null,
	current_maintenance_cost : number | null,
	depreciation_price : number | null,
	practical_cost : number | null,
}

export default Vue.extend( {

	name : 'amortization',
	components : {
		newItemButton,
		editItemDialog,
		deleteItemDialog
	},

	data () {
		return {
			id : id,
			loading : true,
			search : '',

			dialogDelete : false,
			dialogEdit : false,
			target : {} as Item | undefined,

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
				},
				{
					text : 'Действия',
					align : 'end',
					value : 'actions',
					sortable : false,
					filterable : false
				}
			],

			items : [] as Item[],

			rules : {
				required : ( val : string ) => !!val || 'Обязательное поле',
				number : ( val : string ) => !isNaN( Number( val ) ) || 'Только числа',
				positive : ( val : number ) => val >= 0 || 'Число должно быть больше или равно нулю'
			}

		}
	},

	async created () {

		try {

			const data = await api.get( 'amortizations' )
			this.items = data.data.items

			this.loading = false

		} catch ( e ) {
			console.error( e )
		}

	},

	mounted () {
		if ( this.$route.query.search )
			this.search = String( this.$route.query.search )
	},

	methods : {

		declination ( number : number, titles : string[] ) {
			const cases = [ 2, 0, 1, 1, 1, 2 ]
			return titles[ ( number % 100 > 4 && number % 100 < 20 ) ? 2 : cases[ ( number % 10 < 5 ) ? number % 10 : 5 ] ]
		},

		// create

		createItem () {
			this.target = {
				[ id ] : 0,
				name : '',
				resource : null,
				purchase_price : null,
				capital_repair_cost : null,
				total_cost_current_repair : null,
				service_life : null,
				average_yearly_mileage : null,
				average_monthly_mileage : null,
				current_maintenance_cost : null,
				practical_cost : null,
				depreciation_price : null
			}
			this.dialogEdit = true
		},

		// edit

		editItem ( identifier : number ) {
			this.target = Object.assign( {}, this.items.find( e => e[ id ] == identifier ) )
			this.dialogEdit = true
		},

		// save

		async saveItemConfirm () {

			if ( !this.target )
				return

			this.loading = true

			try {

				if ( !this.target[ id ] ) {

					// create new item

					const response = await api.post( baseUrl, {
						name : this.target.name,
						resource : this.target.resource,
						purchase_price : this.target.purchase_price,
						capital_repair_cost : this.target.capital_repair_cost,
						total_cost_current_repair : this.target.total_cost_current_repair,
						service_life : this.target.service_life,
						average_yearly_mileage : this.target.average_yearly_mileage,
						average_monthly_mileage : this.target.average_monthly_mileage,
						current_maintenance_cost : this.target.current_maintenance_cost,
						practical_cost : this.target.practical_cost,
						depreciation_price : this.target.depreciation_price
					} )

					this.target[ id ] = response.data.inserted_id
					this.items.push( this.target )

				} else {

					// update exist item

					await api.put( `${ baseUrl }/${ this.target[ id ] }`, {
						name : this.target.name,
						resource : this.target.resource,
						purchase_price : this.target.purchase_price,
						capital_repair_cost : this.target.capital_repair_cost,
						total_cost_current_repair : this.target.total_cost_current_repair,
						service_life : this.target.service_life,
						average_yearly_mileage : this.target.average_yearly_mileage,
						average_monthly_mileage : this.target.average_monthly_mileage,
						current_maintenance_cost : this.target.current_maintenance_cost,
						practical_cost : this.target.practical_cost,
						depreciation_price : this.target.depreciation_price
					} )

					this.$set( this.items, this.items.findIndex( e => e[ id ] == this.target?.[ id ] ), this.target )

				}

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogEdit = false
			}

		},

		// delete

		deleteItem ( identifier : number ) {
			this.target = Object.assign( {}, this.items.find( e => e[ id ] == identifier ) )
			this.dialogDelete = true
		},

		async deleteItemConfirm () {

			this.loading = true

			try {

				// delete item

				await api.delete( `${ baseUrl }/${ this.target?.[ id ] }` )
				this.items.splice( this.items.findIndex( e => e[ id ] == this.target?.[ id ] ), 1 )

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogDelete = false
			}

		}

	},

	filters : {
		delimiter ( value : string ) {
			return value.toLocaleString()
		}
	}

} )

</script>

<style lang="scss" scoped></style>
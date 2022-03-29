<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="8" offset="2">

		<h1 class="display-1">Статьи расходов</h1>

		<new-item-button @click.native="createItem">Добавить новую статью расходов</new-item-button>

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
			no-results-text="Не найдено ни одного подходящего элемента"
			:search="search"
			no-data-text="Нет сохраненных статей расходов"
			:items-per-page="15"
		>

		  <template v-slot:item.index="{ item }">
			#{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="item" :href="`expenditure-items?search=${item.name}`">{{ item.name }}</a>
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
					counter="50"
					:rules="[rules.required]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.measurement_unit"
					label="Единицы измерения"
					counter="25"
					:rules="[rules.required]"
				/>
			  </v-col>
			  <v-col>
				<v-text-field
					v-model="target.price"
					label="Стоимость"
					:rules="[rules.required, rules.number, rules.positive]"
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
import editItemDialog from '@/components/edit-item-dialog.vue'
import deleteItemDialog from '@/components/delete-item-dialog.vue'
import newItemButton from '@/components/new-item-button.vue'

const baseUrl = 'expenditure-items'
const id = 'expenditure_item_id'

interface Item {
	[ id ] : number,
	name : string,
	measurement_unit : string,
	price : number | null
}

export default Vue.extend( {
	name : 'expenditure-items',
	components : {
		newItemButton,
		deleteItemDialog,
		editItemDialog
	},

	data () {
		return {
			id : id,
			loading : false,
			search : '',

			dialogDelete : false,
			dialogEdit : false,
			target : {} as Item | undefined,

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
					text : 'Единицы измерения',
					align : 'center',
					value : 'measurement_unit'
				},
				{
					text : 'Стоимость',
					align : 'center',
					value : 'price'
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

			const data = await api.get( baseUrl )
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

		// create

		createItem () {
			this.target = {
				[ id ] : 0,
				name : '',
				measurement_unit : '',
				price : null
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
						measurement_unit : this.target.measurement_unit,
						price : this.target.price
					} )

					this.target[ id ] = response.data.inserted_id
					this.items.push( this.target )

				} else {

					// update exist item

					await api.put( `${ baseUrl }/${ this.target[ id ] }`, {
						name : this.target.name,
						measurement_unit : this.target.measurement_unit,
						price : this.target.price
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

	}

} )
</script>
<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="8" offset="2">

		<h1 class="display-1">Прайс Лист</h1>

		<!-- add item -->

		<new-item-button @click.native="createItem">Добавить новый элемент</new-item-button>

		<!-- search -->

		<v-text-field
			v-if="!loading"
			v-model="search"
			append-icon="mdi-magnify"
			label="Поиск"
		></v-text-field>

		<!-- table -->

		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="items"
			:loading="loading"
			loading-text="Загрузка..."
			loader-height="2"
			no-data-text="Нет сохраненных элементов"
			no-results-text="Не найдено ни одного подходящего элемента"
			:items-per-page="-1"
			:search="search"
		>

		  <template v-slot:item.index="{ item }">
			<small>#</small>{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.price="{ item }">
			<span v-if="item.price">
			  {{ item.price | delimiter }} <small>руб.</small>
			</span>
			<small v-else>не установлена</small>
		  </template>

		  <template v-slot:item.actions="{ item }">
			<v-icon small @click="editItem(item.price_id)" class="mr-2">mdi-pencil</v-icon>
			<v-icon small @click="deleteItem(item.price_id)">mdi-delete</v-icon>
		  </template>

		</v-data-table>

		<!-- modal dialogs -->

		<edit-item-dialog @confirm="saveItemConfirm" :dialogEdit.sync="dialogEdit" :rules="rules" :target="target"
						  :loading="loading">

		  <template v-slot:header v-if="target">
			{{ target.price_id ? 'Редактирование' : 'Создание' }}
		  </template>

		  <template v-if="target">
			<v-row>
			  <v-col>
				<v-textarea
					v-model="target.title"
					label="Наименование"
					counter="255"
					:rules="[rules.required]"
				/>
			  </v-col>
			</v-row>
			<v-row>
			  <v-col>
				<v-text-field
					v-model="target.price"
					label="Цена"
					hint="Необязательное поле"
					:rules="[rules.number, rules.positive]"
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

interface Item {
	price_id : number,
	title : string,
	price : number | null
}

export default Vue.extend( {
	name : 'price-list',
	components : {
		newItemButton,
		deleteItemDialog,
		editItemDialog
	},

	data () {
		return {

			search : '',
			valid : false,
			loading : true,

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
					value : 'title'
				},
				{
					text : 'Цена',
					align : 'end',
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
			const data = await api.get( 'price-list' )
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

	filters : {
		delimiter ( value : number ) {
			return value.toLocaleString()
		}
	},

	methods : {

		// create

		createItem () {
			this.target = {
				price_id : 0,
				title : '',
				price : null
			}
			this.dialogEdit = true
		},

		// edit

		editItem ( price_id : number ) {
			this.target = Object.assign( {}, this.items.find( e => e.price_id == price_id ) )
			this.dialogEdit = true
		},

		// save

		async saveItemConfirm () {

			if ( !this.target )
				return

			this.loading = true

			try {

				if ( !this.target.price_id ) {

					// create new item

					const response = await api.post( `price-list`, {
						title : this.target.title,
						price : this.target.price
					} )

					this.target.price_id = response.data.inserted_id
					this.items.push( this.target )

				} else {

					// update exist item

					await api.put( `price-list/${ this.target.price_id }`, {
						title : this.target.title,
						price : this.target.price
					} )

					this.$set( this.items, this.items.findIndex( e => e.price_id == this.target?.price_id ), this.target )

				}

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogEdit = false
			}

		},

		// delete

		deleteItem ( price_id : number ) {
			this.target = Object.assign( {}, this.items.find( e => e.price_id == price_id ) )
			this.dialogDelete = true
		},

		async deleteItemConfirm () {

			this.loading = true

			try {

				// delete item

				await api.delete( `price-list/${ this.target?.price_id }` )
				this.items.splice( this.items.findIndex( e => e.price_id == this.target?.price_id ), 1 )

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogDelete = false
			}

		}

	}

} )
</script>

<style lang="scss" scoped></style>
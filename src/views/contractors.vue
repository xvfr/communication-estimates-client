<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="6" offset="3">

		<h1 class="display-1">Подрядчики</h1>

		<new-item-button @click.native="createItem">Добавить нового подрядчика</new-item-button>

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
			no-data-text="Нет сохраненных подрядчиков"
			:items-per-page="15"
			no-results-text="Не найдено ни одного подходящего элемента"
			:search="search"
		>

		  <template v-slot:item.index="{ item }">
			{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="item" :href="`contractors/${item.contractor_id}`">{{ item.name }}</a>
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
		  </template>

		</edit-item-dialog>

		<delete-item-dialog @confirm="deleteItemConfirm" :dialogDelete.sync="dialogDelete" :loading="loading" />

	  </v-col>
	</v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'
import newItemButton from '@/components/new-item-button.vue'
import api from '@/api'
import deleteItemDialog from '@/components/delete-item-dialog.vue'
import editItemDialog from '@/components/edit-item-dialog.vue'

const baseUrl = 'contractors'
const id = 'contractor_id'

interface Item {
	[ id ] : number,
	name : string,
	contracts_count : number
}

export default Vue.extend( {
	name : 'contractors',
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
					text : 'Количество договоров',
					align : 'center',
					value : 'contracts_count'
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
				required : ( val : string ) => !!val || 'Обязательное поле'
			}

		}
	}
	,

	async created () {

		try {

			const data = await api.get( 'contractors' )
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
				contracts_count : 0
			}
			this.dialogEdit = true
		}
		,

		// edit

		editItem ( identifier
					   :
					   number
		) {
			this.target = Object.assign( {}, this.items.find( e => e[ id ] == identifier ) )
			this.dialogEdit = true
		}
		,

		// save

		async saveItemConfirm () {

			if ( !this.target )
				return

			this.loading = true

			try {

				if ( !this.target[ id ] ) {

					// create new item

					const response = await api.post( baseUrl, {
						name : this.target.name
					} )

					this.target[ id ] = response.data.inserted_id
					this.items.push( this.target )

				} else {

					// update exist item

					await api.put( `${ baseUrl }/${ this.target[ id ] }`, {
						name : this.target.name
					} )

					this.$set( this.items, this.items.findIndex( e => e[ id ] == this.target?.[ id ] ), this.target )

				}

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogEdit = false
			}

		}
		,

		// delete

		deleteItem ( identifier
						 :
						 number
		) {
			this.target = Object.assign( {}, this.items.find( e => e[ id ] == identifier ) )
			this.dialogDelete = true
		}
		,

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

<style lang="scss" scoped>

.item {

  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

}

</style>
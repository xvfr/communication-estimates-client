<template>

  <v-container class="fill-height">
	<v-row>
	  <v-col cols="6" offset="3">

		<h1 class="display-1">Оборудование</h1>

		<new-item-button @click.native="createItem">Добавить новое оборудование</new-item-button>

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
			no-data-text="Нет сохраненного оборудования"
			:items-per-page="15"
		>

		  <template v-slot:item.index="{ item }">
			#{{ items.indexOf( item ) + 1 }}
		  </template>

		  <template v-slot:item.name="{ item }">
			<a class="text-decoration-none" :href="`equipments?search=${item.name}`">{{ item.name }}</a>
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
import crudDialogMixin from '@/components/crud-dialog-mixin'

export default Vue.extend({

	name : 'equipments',
	mixins : [crudDialogMixin],

	data () {
		return {
			loading : false,
			search : '',

			id : 'equipment_id',
			baseUrl : 'equipments',
			defaultTarget : {
				equipment_id : 0,
				name : ''
			},

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
					text : 'Действия',
					align : 'end',
					value : 'actions',
					sortable : false,
					filterable : false
				}
			],

			rules : {
				required : ( val : string ) => !!val || 'Обязательное поле'
			}
		}
	},


	mounted () {
		if ( this.$route.query.search )
			this.search = String( this.$route.query.search )
	},

})
</script>
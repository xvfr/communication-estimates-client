<template>

  <v-dialog v-model="dialog" max-width="25%">
	<v-card>
	  <v-card-title class="text-h5">Удаление</v-card-title>
	  <v-card-text class="pb-0">Вы действительно хотите удалить этот элемент?</v-card-text>
	  <v-card-actions>
		<v-spacer></v-spacer>
		<v-btn plain color="grey" @click="dialog = false">Отмена</v-btn>
		<v-btn plain color="error" :loading="loading" @click="$emit('confirm')" @keyup.enter="$emit('confirm')">
		  Удалить
		</v-btn>
		<v-spacer></v-spacer>
	  </v-card-actions>
	</v-card>
  </v-dialog>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend( {
	name : 'delete-item-dialog',

	props : {
		dialogDelete : Boolean,
		loading : Boolean
	},

	computed : {

		dialog : {
			get () {
				return ( this as any ).dialogDelete
			},
			set () {
				( this as any ).$emit( 'update:dialogDelete', false )
			}
		}

	}

} )
</script>
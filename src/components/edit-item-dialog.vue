<template>

  <v-dialog v-model="dialog" max-width="50%">
	<v-card v-if="target">
	  <v-card-title class="text-h5">
		<slot name="header"></slot>
	  </v-card-title>
	  <v-card-text class="pb-0">
		<v-form v-model="valid" @submit.prevent="$emit('confirm')">
		  <v-container>
			<slot></slot>
		  </v-container>
		</v-form>
	  </v-card-text>
	  <v-card-actions>
		<v-spacer></v-spacer>
		<v-btn plain color="grey" @click="dialog = false">Отмена</v-btn>
		<v-btn plain color="success" :loading="loading" @click="$emit('confirm')" :disabled="!valid">Сохранить
		</v-btn>
		<v-spacer></v-spacer>
	  </v-card-actions>
	</v-card>
  </v-dialog>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend( {
	name : 'edit-item-dialog',

	props : {
		dialogEdit : Boolean,
		loading : Boolean,
		target : Object,
		rules : Object
	},

	data () {
		return {
			valid : false
		}
	},

	computed : {

		dialog : {
			get () {
				return ( this as any ).dialogEdit
			},
			set () {
				( this as any ).$emit( 'update:dialogEdit', false )
			}
		}

	}

} )
</script>
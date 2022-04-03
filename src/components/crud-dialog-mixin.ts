import Vue from 'vue'
import api from '@/api'

import newItemButton from '@/components/new-item-button.vue'
import editItemDialog from '@/components/edit-item-dialog.vue'
import deleteItemDialog from '@/components/delete-item-dialog.vue'

export default Vue.extend( {

	components : {
		newItemButton,
		editItemDialog,
		deleteItemDialog
	},

	data () {
		return {
			loading : false,
			id : '',
			baseUrl : '',
			target : {} as any,
			defaultTarget : Object,
			items : [] as object[],
			dialogDelete : false,
			dialogEdit : false
		}
	},

	methods : {

		deleteItem ( identifier : number ) {
			this.target = Object.assign( {}, this.items.find( ( e : any ) => e[ this.id ] == identifier ) )
			this.dialogDelete = true
		},

		async deleteItemConfirm () {

			this.loading = true

			try {
				// delete item
				await api.delete( `${ this.baseUrl }/${ this.target?.[ this.id ] }` )
				this.items.splice( this.items.findIndex( ( e : any ) => e[ this.id ] == this.target?.[ this.id ] ), 1 )
			} finally {
				this.target = undefined
				this.loading = false
				this.dialogDelete = false
			}

		},

		// create

		createItem () {
			this.target = Object.assign( {}, this.defaultTarget )
			this.dialogEdit = true
		},

		// edit

		editItem ( identifier : number ) {
			this.target = Object.assign( {}, this.items.find( ( e : any ) => e[ this.id ] == identifier ) )
			this.dialogEdit = true
		},

		// save

		async saveItemConfirm () {

			if ( !this.target )
				return

			this.loading = true

			try {

				if ( !this.target[ this.id ] ) {

					// create new item
					const response = await api.post( this.baseUrl, this.target )
					this.target[ this.id ] = response.data.inserted_id
					this.items.push( this.target )

				} else {

					// update exist item
					await api.put( `${ this.baseUrl }/${ this.target[ this.id ] }`, this.target )
					this.$set( this.items, this.items.findIndex( ( e : any ) => e[ this.id ] == this.target?.[ this.id ] ), this.target )

				}

			} finally {
				this.target = undefined
				this.loading = false
				this.dialogEdit = false
			}

		}

	},

	async created () {

		try {
			const data = await api.get( this.baseUrl )
			this.items = data.data.items
			this.loading = false
		} catch ( e ) {
			console.error( e )
		}

	},

} )
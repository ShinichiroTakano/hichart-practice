<template>
  <div>
    <v-combobox
      label="業種"
      :items="businessTypes"
      v-model="selectedBusinessTypesModel"
      attach
      chips
      item-text="name"
      item-value="id"
      multiple>
    </v-combobox>
    <input
      name="quest[business_type_ids][]"
      type="hidden"
      :value="`${selectedBusinessTypeId}`"
      v-for="(selectedBusinessTypeId) in selectedBusinessTypesIds"
      :key="`${selectedBusinessTypeId}`">
  </div>
</template>
<script>
export default {
  name: 'business-types-select',
  props: {
    businessTypes: {
      type: Array,
      required: true
    },
    selectedBusinessTypes: {
      type: Array,
      required: true
    }
  },
  computed: {
    selectedBusinessTypesModel: {
      get() {
        return this.$store.state.quest.selectedBusinessTypes
      },
      set(selectedBusinessTypes) {
        this.$store.commit('quest/setSelectedBusinessTypes', selectedBusinessTypes)
      }
    },
    selectedBusinessTypesIds() {
      return this.selectedBusinessTypesModel.map(e => e.id)
    }
  },
  created() {
    this.$store.commit('quest/setSelectedBusinessTypes', this.selectedBusinessTypes)
  }
}
</script>
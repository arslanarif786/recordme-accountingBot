<template>
    <v-dialog v-model="modal" width="450" persistent>
      <v-card class="card-class">
        <v-card-title class="lighten-2 secondaryTextColor appColor--text font-style-heading">
          <slot name="header"></slot>
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-container class="py-0 pt-1">
        <v-card-text class="py-0 font-style-paragraph secondaryTextColor--text">
          <slot name="text"></slot>
        </v-card-text>
        <v-card-text class="py-0 ">
              <slot name="content"></slot>
        </v-card-text>

         <v-card-actions class="">
            <v-col cols="12" class="pb-0 pr-0 d-flex">
              <v-spacer></v-spacer>
              <Button @button-clicked="close()" :loader="cancelLoader" class="mr-2">
                 <template v-slot:buttonHeading>
                    Cancel
                </template> 
              </Button>
                
              <Button @button-clicked="save()" :loader="saveLoader" class="mr-2">
                 <template v-slot:buttonHeading>
                    Save
                </template> 
              </Button>
            </v-col>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
import Button from "../button"
export default {
  name: "dialogBox",
  components : {
    Button,
  },
  props : {
    modal : Boolean,
  },
  data() {
    return {
      cancelLoader : false,
      saveLoader : false
    };
  },
  mounted() {
  },
  computed: {
   

  },
  created() {},
  methods: {
    close(){
      this.$emit('close-clicked')
    },
    save(){
      this.$emit('save-clicked')
    }
  },
};
</script>

<style scoped>
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}
</style>

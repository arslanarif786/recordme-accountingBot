<template>
  <v-btn
    color="appColor"
    class="white--text text-capitalize"
    @click="buttonClicked()"
    :loading="loader"
  >
   <slot name="buttonHeading"></slot>
  </v-btn>
</template>

<script>
export default {
  name: "Button",
  props: {
    loader : Boolean,
  },
  methods: {
    buttonClicked() {
        this.$emit('button-clicked')
    }
  }
};
</script>

<style scoped>
::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}
</style>

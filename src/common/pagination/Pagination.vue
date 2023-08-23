<template>
  <div
    class="custom-pagination-container d-flex justify-end"
    v-if="totalCount > 0"
  >
    <div class="d-flex align-baseline">
      <div class="footer-pagination-para pagination-enteries">
        <span class="d-flex align-baseline" v-if="pagination > 0">
          <span class="width-page-number"> Rows per page: </span>
          <v-select
            :items="items"
            dense
            filled
            v-model="size"
            @change="selectedRecords()"
            class="font-13 fw-900 mx-2 width-removed"
          ></v-select>
          <span class="width-page-number">
            {{ startNo }} - {{ endNo }} of {{ pagination }}
          </span>
        </span>
        <span v-else> No Records to show </span>
      </div>
      <div class="mr-5">
        <!-- Previous button -->
        <v-btn
          :disabled="page == 1"
          @click="prevPageButton"
          class="prev-btn"
          elevation="0"
          ><v-icon class="pagination-btn-icon fs-22"
            >mdi-chevron-left</v-icon
          ></v-btn
        >
        <!-- Next button -->
        <v-btn
          :disabled="totalCount == 0 || page === xCount"
          @click="nextPageButton"
          class="next-btn ml-8"
          elevation="0"
          ><v-icon class="pagination-btn-icon font-15"
            >mdi-chevron-right</v-icon
          ></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
/**
   * Description: This pagination component is used throughout the application to maintain the styling. The component 
     can show current page text based on prop, page buttons and items per page textfield.
   */
import { mapGetters } from "vuex";
export default {
  name: "Pagination",
  data() {
    return {
      size: null,
      items: [5, 10, 15, 20],
      xCount: null,
      pageCounter: 0,
      startNo: 1,
      endNo: null,
    };
  },
  props: {
    page: {
      type: Number,
      default: 0,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    itemsPerPage: {
      type: Number,
      default: 0,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters({
      noOfRecords: "xeroForm/getNoOfRecords"
    }),
    /**
     * set size of Rows per page in the pagination
     * set startNumber and endNumber of current page
     * set totalCount of all items in the pagination
     */
    pagination() {
      this.page = this.page ? this.page : 1;
      this.size = this.itemsPerPage ? this.itemsPerPage : 10;
      this.startNo = (this.page - 1) * this.size + 1;
      this.endNo = ((this.page - 1) * this.size) + this.noOfRecords;
      const total = this.totalCount;
      this.checkMode();
      return total;
    },
  },
  beforeDestroy() {
    this.$store.commit('xeroForm/setNoOfRecords', 10);
  },
  methods: {
    /**
     * previous button click handler
     */
    prevPageButton() {
      let prepage = this.page - 1;
      if (this.page > 1) {
        console.log("event prepage>>", prepage, this.size);
        this.$emit("prev-page-change", { page: prepage, size: this.size });
      }
    },
    /**
     * next button click handler
     */
    nextPageButton() {
      this.pageCounter = this.pageCount;
      let newpage = this.page + 1;
      if (this.page < this.pageCounter || this.page < this.xCount) {
        console.log("event newpage>>", newpage, this.size);
        this.$emit("next-page-change", { page: newpage, size: this.size });
      }
    },
    /**
     * check Mode of pagination number
     */
    checkMode() {
      this.pageCounter = this.pageCount;
      if (this.totalCount % this.size == 0) {
        this.pageCounter = this.totalCount / this.size;
        this.xCount = Math.floor(this.pageCounter);
      } else {
        this.pageCounter = this.totalCount / this.size;
        this.pageCounter++;
        this.xCount = Math.floor(this.pageCounter);
      }
    },
    /**
     * dropdown to select size of records per page
     */
    selectedRecords() {
      console.log("event>>", this.page, this.size);
      this.$emit("select-size", { page: this.page, size: this.size });
      this.checkMode();
    },
  },
};
</script>

<style>
.pagination-enteries {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  width: 260px;
}

.next-btn,
.prev-btn {
  border-radius: 4px;
  height: 18px !important;
  width: 18px !important;
  min-height: 18px !important;
  min-width: 18px !important;
  padding: 0px !important;
}
.pagination-btn-icon {
  color: #bab9b6 !important;
}

.custom-pagination .v-pagination__item--active {
  /* color: #292b30 !important; */
  font-size: 11px !important;
  font-weight: 600 !important;
  background-color: #6634e9 !important;
  color: white !important;
}
.custom-pagination-container {
  margin: 0px 10px;
}
:deep(.theme--light.v-btn.v-btn--has-bg) {
  background-color: #fff;
}
.custom-pagination-container .theme--light.v-btn.v-btn--has-bg {
  background-color: #fff;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #fff !important;
}
.theme--light.v-btn.v-btn--disabled {
  color: #fff !important;
}
.width-removed {
  width: 58px !important;
  min-height: 37px !important;
}
.custom-pagination-container
  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot,
.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0 0 0 8px;
}
.custom-pagination-container .v-input__slot {
  font-size: 12px;
  background-color: #ffffff !important;
}

.width-page-number {
  width: 95px;
}
</style>

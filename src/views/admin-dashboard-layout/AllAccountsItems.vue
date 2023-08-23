<template>
  <div>
    <SnackBar />
    <NavigationBar />
    <AppBar />
    <AddNewItem :dialog="itemDialog" @closeItemDialog="itemDialog = false" />
    <Search @search-input="debounceInput"/>
    <template>
      <v-btn
        icon
        depressed
        class="text-capitalize mt-3 ml-3"
        color="appColor"
        outlined
        small
        @click="itemDialog = true"
      >
        <v-icon small> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-data-table
      :headers="headers"
      :items="allItems"
      :loading="loadTable"
      :hide-default-footer="true"
      :server-items-length="total ? total : paginate.total"
      :itemsPerPage="paginate.itemsPerPage"
      >
      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
      </template>
    </v-data-table>
    <Pagination
      :itemsPerPage="paginate.size"
      :page="paginate.page"
      :pageCount="paginate.lastPage"
      :totalCount="total ? total : paginate.total"
      @next-page-change="fetchItems($event)"
      @prev-page-change="fetchItems($event)"
      @select-size="fetchItems($event)"
    ></Pagination>
  </div>
</template>

<script>
import AppBar from "../../app/components/layout/appbar/Appbar.vue";
import SnackBar from "../../common/snackbar/Snackbar.vue";
import NavigationBar from "../../app/components/layout/navigation-bar/NavigationBar.vue";
import AddNewItem from "../../app/components/admin-dashboard/dialog-box/AddNewItem.vue";
import Pagination from "../../common/pagination/Pagination.vue"
import { mapGetters } from "vuex";
import { debounce } from "debounce";
import Search from "../../common/search/Search.vue"

export default {
  name: "AllAccountsItems",
  components: {
    AppBar,
    SnackBar,
    NavigationBar,
    AddNewItem,
    Pagination,
    Search
  },
  computed: {
    ...mapGetters({
      allItems: "xeroForm/getAllItems",
      total: "xeroForm/getTotalItems"
    }),
  },
  async mounted() {
    /**
     * Get all account-items from Xero
     */
    this.paginate['changeCounter'] = true;
    await this.$store.dispatch("xeroForm/getItemsFromXero", this.paginate);
    this.loadTable = false;
  },
  data: () => ({
    loadTable: true,
    paginate: {
      size: 10,
      page: 1,
      lastPage: 10,
      total: 0,
    },
    headers: [
      { text: "Item Name", value: "itemName", width: "400px" },
      { text: "Created At", value: "createdAt" },
    ],
    itemDialog: false,
    searchObj: {},
  }),
  methods: {
    /**
     * Method to get data in datatable of all-items
     */
    fetchItems(obj) {
      console.log('event in fetch items>>', obj)
      if (!obj.page) obj.page = 1;
      this.loadTable = true;
      if(this.searchObj) {
        obj['search'] = this.searchObj['search'];
        obj['changeCounter'] = this.searchObj['changeCounter'] = true;
      }
      this.$store
        .dispatch("xeroForm/getItemsFromXero", obj)
        .then((res) => {
          this.paginate.size = obj.size;
          this.paginate.page = obj.page;
          this.loadTable = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadTable = false;
        });
    },
    /**
     * Method to search the specific result from all items
     */
     debounceInput: debounce(async function (e) {
      this.loadTable = true;
      this.searchObj['search'] = e;
      this.searchObj['page'] = this.paginate.page;
      this.searchObj['size'] = this.paginate.size;
      this.searchObj['changeCounter'] = this.paginate['changeCounter'] = true;
      this.paginate.page = 1;
      await this.$store.dispatch("xeroForm/getItemsFromXero", this.searchObj);
      this.loadTable = false;
    }, 700),
  }
};
</script>

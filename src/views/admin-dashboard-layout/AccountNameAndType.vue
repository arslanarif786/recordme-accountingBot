<template>
  <div>
    <SnackBar />
    <NavigationBar />
    <AppBar />
    <Search @search-input="debounceInput"/>
   
    <CreateAccounts
      :dialog="accountsDialog"
      @closeAccountsDialog="accountsDialog = false"
    />
    <UpdateAccounts
      :dialog="editAccountsDialog"
      :item="selectedItem"
      @closeEditAccountsDialog="editAccountsDialog = false"
    />
    <template>
      <v-btn
        icon
        depressed
        class="text-capitalize mt-3 ml-3"
        color="appColor"
        outlined
        small
        @click="accountsDialog = true"
      >
        <v-icon small> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-data-table 
      :headers="headers" 
      :items="accountItems"
      :loading="loadTable"
      :hide-default-footer="true"
      :server-items-length="total ? total : paginate.total"
      :itemsPerPage="paginate.itemsPerPage"
      >
      <template v-slot:[`item.itemIds`]="{ item }">
        <div v-if="item.itemIds.length">
          <div v-for="(accItem, index) in item?.itemIds" :key="index">
            <span v-if="index < 2">
              {{ accItem.itemName }}
            </span>
            <span v-if="index < 1 && item.itemIds.length > 1"> , </span>
            <v-menu offset-y open-on-hover max-height="30vh">
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  v-if="index === 2"
                  class="grey--text text-caption cursor-pointer"
                >
                  (+{{ item?.itemIds.length - 2 }} others)</span
                >
              </template>
              <v-list>
                <div v-for="(nestedItem, index) in item?.itemIds" :key="index">
                  <v-list-item v-if="index > 1">
                    <v-list-item-title class="cursor-pointer">{{
                      nestedItem.itemName
                    }}</v-list-item-title>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div v-else> - </div>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              @click="editAccountDialogBox(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
          </template>
          <span>Update Account Items</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <Pagination
      :itemsPerPage="paginate.size"
      :page="paginate.page"
      :pageCount="paginate.lastPage"
      :totalCount="total ? total : paginate.total"
      @next-page-change="getAccountitems($event)"
      @prev-page-change="getAccountitems($event)"
      @select-size="getAccountitems($event)"
    ></Pagination>
  </div>
</template>

<script>
import AppBar from "../../app/components/layout/appbar/Appbar.vue";
import SnackBar from "../../common/snackbar/Snackbar.vue";
import NavigationBar from "../../app/components/layout/navigation-bar/NavigationBar.vue";
import CreateAccounts from "@/app/components/admin-dashboard/dialog-box/CreateAccounts.vue";
import UpdateAccounts from "@/app/components/admin-dashboard/dialog-box/UpdateAccounts.vue";
import { mapGetters } from "vuex";
import Pagination from "../../common/pagination/Pagination.vue"
import CsvFeature from "@/app/components/upload-csv-admin"
import Search from "../../common/search/Search.vue"
import { debounce } from "debounce";

export default {
  name: "ItemsAndAccounts",
  components: {
    AppBar,
    SnackBar,
    NavigationBar,
    CreateAccounts,
    UpdateAccounts,
    Pagination,
    Search,
    CsvFeature
  },
  computed: {
    ...mapGetters({
      accountItems: "xeroForm/getAccountItems",
      total: "xeroForm/getTotalItems"
    }),
  },
  async mounted() {
    this.paginate['isAdmin'] = true;
    await this.$store.dispatch("xeroForm/getAccountItems", this.paginate);
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
    selectedItem: {},
    headers: [
      { text: "Account Name", value: "accountName" , width:'350px'},
      { text: "Account Type", value: "accountType" },
      { text: "Items", value: "itemIds" },
      { text: "Created At", value: "createdAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    accountsDialog: false,
    editAccountsDialog: false,
    searchObj: {},
  }),
  methods: {
    /**
     * Method to open edit-account-items dialog
     * @param {*} item
     */
    editAccountDialogBox(item) {
      this.editAccountsDialog = true;
      this.selectedItem = item;
    },
    /**
     * Method to get data in datatable of account-items
     */
    getAccountitems(obj) {
      console.log('event get in accounts items>>', obj)
      if (!obj.page) obj.page = 1;
      obj['isAdmin'] = true;
      if(this.searchObj) obj['search'] = this.searchObj['search'];
      console.log(obj);
      this.loadTable = true;
      this.$store
        .dispatch("xeroForm/getAccountItems", obj)
        .then((res) => {
          this.paginate.size = obj.size;
          this.paginate.page = obj.page;
          this.loadTable = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadTable = false;
        })
    },
    /**
     * Method to search the specific result from chart of accounts
     */
     debounceInput: debounce(async function (e) {
      this.loadTable = true;
      this.searchObj['search'] = e;
      this.searchObj['isAdmin'] = true;
      this.searchObj['page'] = 1;
      this.searchObj['size'] = this.paginate.size;
      this.paginate.page = 1;
      await this.$store.dispatch("xeroForm/getAccountItems", this.searchObj);
      this.loadTable = false;
    }, 700),
  },
};
</script>

<style scoped>
.cursor-pointer{
  cursor: pointer;
}
</style>

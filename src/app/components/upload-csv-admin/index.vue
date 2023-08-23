<template>
  <div>
    <!-- A Button component is being rendered with the text "Upload CSV" -->
    <!-- <Button
      class="mt-4 mx-2"
      @button-clicked="handleFileImport"
      :loader="csvLoader"
    >
      <template v-slot:buttonHeading> Upload CSV </template>
    </Button> -->
    <!-- A file input element is added for file selection -->
    <input ref="uploader" class="d-none" type="file" @change="onFileChanged" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import UrlServices from "@/services/Url";
import Button from "@/common/button";
import EventBus from "@/js/EventBus";

// Component definition
export default {
  name: "index",
  components: {
    Button, // Button component is imported and added as a component
  },
  computed: {
    // Mapped getters from vuex store
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
  },
  data() {
    return {
      isSelecting: false,
      selectedFile: null,
      csvLoader: false, // Indicates if the csv is being loaded
    };
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    // Method for handling file import
    handleFileImport() {
      this.isSelecting = true;

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    // Method to handle file change
    async onFileChanged(e) {
      try {
        this.csvLoader = true;
        this.selectedFile = e.target.files[0];
        this.validation();
        this.$papa.parse(this.selectedFile, {
          complete: async (results) => {
            try {
              let res = this.modifyData(results);
              await this.apiCall(res)
              this.$store.dispatch("xeroForm/getAccountItems", true);
              this.userResponse("success");
            } catch (error) {
              this.userResponse("error", error);
            }
          },
        });
      } catch (error) {
        this.userResponse("error", error);
      }
    },
    // Method to validate the selected file
    validation() {
      if (this.selectedFile?.type !== "text/csv")
        throw new Error("File type is not csv");
    },
    // Method to modify the data
    modifyData(results) {
      let newData = [],
        dataObject = {};
      results.data.slice(1).forEach((item) => {
        dataObject = {
          account_name: item[0],
          account_description: item[1],
          account_type: item[2],
          items: this.conversion(item, 3),
        };
        newData.push(dataObject);
      });
      return newData;
    },
    // Method to join array and remove empty index
    conversion(item, index) {
      let array = item.slice(index).filter((element) => {
        return Boolean(element);
      });
        //   return array.join();
        return array
    },
    // Method to display snackbar and reset data
    userResponse(type, response = "Csv Updated") {
      EventBus.$emit("show-snackbar", { text: response, type: type });
      this.isSelecting = false;
      this.selectedFile = null;
      this.csvLoader = false;
    },
    // Method to API call for storing data in database
    async apiCall(data) {
      var config = {
        method: "post",
        url: `${UrlServices.createAccountItems}`,
        data: { accounts: data },
        headers: {
          Authorization: this.token,
        },
      };
      return await axios(config);
    },
  },
};
</script>
<style scoped></style>

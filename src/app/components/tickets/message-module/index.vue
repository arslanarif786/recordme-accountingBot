<template>
  <div>
    <div v-if="message.file && message.fileUrl.includes('audio.wav')">
      <audio controls>
        <source :src="url" />
        Your browser does not support the audio element.
      </audio>
    </div>
    <p
      class="message-comment font-style-paragraph"
      style="white-space: pre-line"
      v-else
    >
      {{ message.text }}
      <span class="text-caption d-block my-1 text-end">
        <template v-if="message.fileUrl" class="font-style-paragraph">
          <p
            class="appColor--text message-comment font-style-paragraph"
            @click="openPrivateUrl(message.fileUrl)"
            style="cursor: pointer"
          >
            {{message.file.originalname ? message.file.originalname : 'Attachment' }}
          </p>
        </template>
        {{ message.createdAt | formatTime }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "MessageModule",
  data() {
    return {
      url:""
    };
  },
  props: {
    message: Object,
  },
  mounted() {
    if (this.message.file && this.message.fileUrl.includes("audio.wav")) {
      const getBlob = async () => {
        this.url = await this.b64toBlob(this.message.file);
        this.url = window.URL.createObjectURL(this.url);
        console.log(this.url);
      };
      getBlob();
    }
  },
  computed: {},
  methods: {
    openPrivateUrl(url) {
      this.$emit("openPrivateUrl", url);
    },
    async b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
  },
};
</script>
<style scoped>
::v-deep .message-comment {
  padding: 0px !important;
  margin: 0px !important;
}
</style>

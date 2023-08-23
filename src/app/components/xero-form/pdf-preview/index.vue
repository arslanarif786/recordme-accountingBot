<template>
  <div>
    <center class="mt-2">
        <object :data="pdfUrl"
                ref="obj" 
                width="470" 
                height="700"> 
        </object>
    </center>
  </div>  
</template>



<script>
import { mapGetters } from "vuex";  
import pdf from 'pdfvuer'
import 'pdfjs-dist/build/pdf.worker.entry' // not needed since v1.9.1

export default {
  name: "index",
  components: {
    pdf
  },
  data() {
    return { 
    };
  },
  mounted(){
    this.$refs.obj.onload = () => {
      const targetElement = this.$refs.obj.contentDocument.querySelector('body img')
      if(targetElement) targetElement.style="width:100%;height:100%"
    }
  },  
  computed: {
    ...mapGetters({
      pdfUrl: "xeroForm/getPdfLink",
    }),
  },
};
</script>

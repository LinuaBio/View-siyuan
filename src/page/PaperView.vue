<template>
    <PaperList :listData=arr></PaperList>
</template>

<script lang="ts">
import PaperList from '../components/PaperList.vue';
export default {
  components: { PaperList },
  data() {
    return {
      arr:[
        {"title":"A:This is a single example","author":"A","button":"1Biolinua"},
        {"title":"B:This is a single example","author":"Biolinua","button":"2Biolinua"},
        {"title":"C:This is a single example","author":"C","button":"3Biolinua"},
        {"title":"D:This is a single example","author":"D","button":"4Biolinua"}
      ]
    }
  },    
}
</script>
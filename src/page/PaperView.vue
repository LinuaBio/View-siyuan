<template>
    <div class="container">
        <div class="left-column">
            <PaperRightMenu>
                <PaperList :listData=arr @selectedInf="handleSelectedInf"></PaperList>
            </PaperRightMenu>
        </div>
        <div class="right-column">
            <PaperInfTopMenu style="height: 20px;"></PaperInfTopMenu>
            <PaperInf :item="PaperInf"></PaperInf>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PaperList from '../components/PaperList.vue';
import PaperInf from '../components/PaperInf.vue'
import PaperRightMenu from '../components/PaperRightMenu.vue'
import PaperInfTopMenu from '../components/PaperInfTopMenu.vue'

export default defineComponent({
    components: {
        PaperList, PaperInf, PaperRightMenu, PaperInfTopMenu
    },
    data: function () {
        return {
            selectedInf: 0,
            arr: [
                { "title": "A:This is a single example", "author": "A", "button": "1Biolinua" },
                { "title": "B:This is a single example", "author": "Biolinua", "button": "2Biolinua" },
                { "title": "C:This is a single example", "author": "C", "button": "3Biolinua" },
                { "title": "D:This is a single example", "author": "D", "button": "4Biolinua" }
            ]
        }
    },
    methods: {
        handleSelectedInf(inf: any) {
            this.selectedInf = inf;
        },
    },
    computed: {
        PaperInf() {
            return this.arr[this.selectedInf]
        }
    },
})
</script>
<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
}

.left-column {
    width: 60%;
    margin-right: 5%;
}

.right-column {
    width: 30%;
}

@media (max-width: 768px) {
    .left-column {
        width: 100%;
        margin-right: 0;
    }

    .right-column {
        width: 100%;
        margin-top: 16px;
    }
}
</style>
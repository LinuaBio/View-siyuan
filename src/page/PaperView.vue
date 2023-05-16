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
import PaperList from '../components/paper/PaperList.vue';
import PaperInf from '../components/paper/PaperInf.vue'
import PaperRightMenu from '../components/paper/PaperRightMenu.vue'
import PaperInfTopMenu from '../components/paper/PaperInfTopMenu.vue'

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
<style scoped lang="scss">
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
}

.container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 73%;
    width: 3px;
    /* 线的宽度 */
    height: 100%;
    background-color: #696969;
    /* 线的颜色 */
}

.left-column {
    width: 72%;
    /* padding-right: 0.1%; */
}

.right-column {
    width: 26%;
}

@media (max-width: 768px) {
    .container:before {
        display: none;
    }

    .left-column {
        width: 100%;
        margin-right: 0;
    }

    .right-column {
        width: 100%;
        margin-top: 16px;
    }
}</style>
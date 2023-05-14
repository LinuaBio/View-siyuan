<template>
    <div>
        <table class="PaperListTable">
            <colgroup v-for="(width, index) in columnWidths.values" :key="index" :style="{ width: width + '%' }"></colgroup>
            <thead>
                <tr>
                    <th v-for="(item, index) in extractedKeysList" :key="index"
                        style="resize: horizontal; overflow: hidden"
                        @mousedown.stop="onMouseDown($event, item)">
                        {{ item.key[0].toUpperCase() + item.key.substring(1) }}
                        <span v-if="sortedColumn === item.key" :class="sortOrder" ></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in listData" :key="index">
                    <td v-for="(key, index) in item" :key="index">{{ key }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
const props = defineProps<{ listData: { [key: string]: any }[] }>()
const columnWidths = ref([20, 80])
const keys = Object.keys(props.listData[0])
const extractedKeysList = reactive(keys.map(key => ({ key, order: 1 })))
const sortedColumn = ref('')

const sortOrder = computed(() => {
    return extractedKeysList.find(k => k.key === sortedColumn.value).order === 1
        ? 'sort-asc'
        : 'sort-desc'
})
const onMouseDown = (event, item) =>{
    //@click="orderBy(item.key)"
    // 判断鼠标点击的位置是否在排序图标区域之外
    // const midX = item.$el.offsetLeft + item.$el.offsetWidth / 2;
    // midX
    console.log(event.offsetX, (item.key.length + 1) * 9)
    if (event.offsetX < (item.key.length + 1) * 9) {
      // 执行拖动改变宽度的操作
      orderBy(item.key);
    }
}
const orderBy = (key: string) => {
    if (sortedColumn.value !== key) {
        sortedColumn.value = key
        extractedKeysList.forEach((k) => {
            if (k.key !== key) k.order = 1
        })
    } else {
        const order = extractedKeysList.find(k => k.key === sortedColumn.value).order
        extractedKeysList.find(k => k.key === sortedColumn.value).order = order * -1
    }
    props.listData.sort((a, b) => {
        const valA = a[key]
        const valB = b[key]
        if (typeof valA === 'string') return valA.localeCompare(valB) * extractedKeysList.find(k => k.key === key).order
        if (typeof valA === 'number') return (valA - valB) * extractedKeysList.find(k => k.key === key).order
        return 0
    })
}
</script>
<style scoped lang="scss">
$height: 35px;

.PaperListTable {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

th {
    padding-top: 5px;
    padding-bottom: 5px;

    &:hover {
        background-color: rgba(101, 101, 101, 0.518)
    }
}

tbody {
    tr {
        &:hover {
            background-color: rgba(101, 101, 101, 0.518)
        }
    }
}

td {
    height: $height;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
}
.sort-asc::before {
    content: '\2191';
    margin-left: 5px;
}

.sort-desc::before {
    content: '\2193';
    margin-left: 5px;
}
</style>
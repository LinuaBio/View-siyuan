<template>
    <table class="PaperListTable">
        <thead>
            <tr>
                <th v-for="(item, index) in extractedKeysList" :key="index" style="resize: horizontal; overflow: hidden;"
                    :style="{ width: columnWidths[index] + 'px' }" :width="defaultColumnWidth(index)">
                    <span @mousedown.stop="orderBy(item.key)">
                        {{ item.key[0].toUpperCase() + item.key.substring(1) }}
                    </span>
                    <span v-if="sortedColumn === item.key" :class="sortOrder"></span>
                </th>
                <th class="no-hover"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in listData" :key="index" :class="{ 'selected': selected === index }"
                @click="this.$emit('selectedInf', index); selected = index">
                <td v-for="(key, index) in item" :key="index">{{ key }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { reactive, ref, computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        listData: {
            type: Array as () => { [key: string]: any }[],
            required: true
        }
    },
    methods: {
        handleItemClick(meg: any) {
            this.$emit('selectedInf', meg);
        }
    },
    setup(props) {
        const keys = Object.keys(props.listData[0])
        const columnWidths = reactive<number[]>([])
        const extractedKeysList = reactive(keys.map(key => ({ key, order: 1 })))
        const sortedColumn = ref('')
        const selected = ref(-1)

        const defaultColumnWidth = (index: number) => {
            return index == 0 ? 300 : 150
        }

        const sortOrder = computed(() => {
            return extractedKeysList.find(k => k.key === sortedColumn.value)?.order === 1
                ? 'sort-asc'
                : 'sort-desc'
        })

        const orderBy = (key: string) => {
            if (sortedColumn.value !== key) {
                sortedColumn.value = key
                extractedKeysList.forEach((k) => {
                    if (k.key !== key) k.order = 1
                })
            } else {
                const order = extractedKeysList.find(k => k.key === sortedColumn.value)?.order
                extractedKeysList.find(k => k.key === sortedColumn.value).order = order! * -1
            }
            props.listData.sort((a, b) => {
                const valA = a[key]
                const valB = b[key]
                if (typeof valA === 'string') {
                    return valA.localeCompare(valB) * extractedKeysList.find(k => k.key === key)!.order
                }
                if (typeof valA === 'number') {
                    return (valA - valB) * extractedKeysList.find(k => k.key === key)!.order
                }
                return 0
            })
        }

        return {
            keys,
            columnWidths,
            extractedKeysList,
            sortedColumn,
            selected,
            defaultColumnWidth,
            sortOrder,
            orderBy
        }
    }
})
</script>
<style scoped lang="scss">
$height: 35px;
$background: rgba(101, 101, 101, 0.518);

.PaperListTable {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    // padding: 20px;
}

.no-hover {
    pointer-events: none;
    cursor: default;
}

th {
    padding-top: 5px;
    padding-bottom: 5px;
    user-select: none;

    &:hover {
        background-color: $background
    }
}

tbody {
    tr {
        &:hover {
            background-color: $background
        }

        &.selected {
            background-color: $background
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

.col-resize {
    top: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    cursor: col-resize;
    background: transparent;

    // &:hover {
    //     background-color: rgba(255, 119, 119, 0.86);
    // }
}
</style>
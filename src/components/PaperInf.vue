<template>
    <div class="info-card">
        <ul class="list">
            <li v-for="(item, idx) in filteredItem" class="item">
                <span class="label">{{ item[0] }}:</span>
                {{ item[1] }}
            </li>
        </ul>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
    name: "InfoDisplay",
    props: {
        item: {
            type: Object as () => PaperItem,
            default: () => ({})
        }
    },
    computed: {
        filteredItem() {
            const { ...rest } = this.item as PaperItem;
            const filtered = new Array() as [string[]]
            for (const key in rest) {
                if (key === "authors") {
                    for(const i in rest[key]){
                        filtered.push([key, rest[key][i]]);
                    }
                } else {
                    filtered.push([key, rest[key] as string]);
                }
            }
            return filtered;
        },
    }
});
</script>
  
<style scoped>
.info-card {

    /* border-radius: 6px; */
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
    /* padding: 20px; */
    margin-bottom: 20px;
}

.title {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.item+.item {
    margin-top: 10px;
}

.label {
    font-weight: bold;
    margin-right: 10px;
}
</style>
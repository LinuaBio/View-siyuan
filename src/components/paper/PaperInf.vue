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
import { defineComponent } from "vue";

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
  
<style scoped lang="scss">
.info-card {
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
    user-select: none;
    font-weight: bold;
    margin-right: 10px;
}
</style>
<template>
    <div class="container">
        <div class="left-column" :style="{ width: leftWidth }">
            <slot name="left"></slot>
        </div>
        <div class="right-column" :style="{ width: rightWidth }">
            <slot name="right"></slot>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ColumnLayout',
    props: {
        leftWidth: {
            type: String,
            required: true
        },
        rightWidth: {
            type: String,
            required: true
        }
    },
    computed: {
        beforeStyle() {
            const w = parseFloat(this.leftWidth) + 1
            return { left: `${w}%` }
        }
    }
})
</script>
  
<style scoped lang="scss">
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
    position: relative;
}

.container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    /* 线的宽度 */
    height: 100%;
    background-color: #696969;
    /* 线的颜色 */
    z-index: -1;
    
}


@media (max-width: 768px) {
    .container::before {
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
}
</style>
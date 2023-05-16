<template>
    <div @contextmenu.prevent="onContextmenu" class="menu" :style="menuStyle">
        <div v-for="(menuItem, index) in menuItems" 
        :class="{ 'selected': isSelected === index }"
        :key="index" class="menu-item" @click="handleClick(menuItem);isSelected=index">
            <span>{{ menuItem }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

    data() {
        return {
            menuVisible: false, // 是否显示右键菜单
            menuTop: 0, // 右键菜单的 top 值
            menuLeft: 0, // 右键菜单的 left 值
            menuItems: ['Paper Information', '菜单项2'], // 右键菜单项
            isSelected: 0, // 是否选中
        };
    },
    methods: {
        onContextmenu(event: { clientY: any; clientX: any; }) {
            this.menuVisible = true;
            this.menuTop = event.clientY;
            this.menuLeft = event.clientX;
        },
        handleClick(menuItem: string) {
            // 处理点击右键菜单项的逻辑
            console.log('点击了菜单项：', menuItem);
            this.menuVisible = false;
        },
    },
    computed: {
        menuStyle() {
            return {
                top: `${this.menuTop}px`,
                left: `${this.menuLeft}px`,
            };
        },
    },
});
</script>
  
<style scoped lang="scss">
.menu {
    padding: 8px 0px 10px 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    background-color: #2d2d2d;
}

.menu-item {
    /* margin: 0 8px; */
    padding: 8px;
    /* display: inline-block; */
    cursor: pointer;
    user-select: none;
}

.menu-item:hover {
    background-color: #4b4b4b;
}
.menu-item.selected {
    // background-color: #00000000;
    border-bottom: 2px solid #3388ff;
}
.right-column {
    position: relative;
    height: calc(100% - 20px);
}

.right-column .menu {
    width: 100%;
    top: 20px;
    left: 0;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
    /* border-radius: 2px; */
}
</style>
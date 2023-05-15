<template>
    <div ref="menu" @contextmenu.prevent="onContextmenu">
        <slot></slot>
        <div v-show="menuVisible" :style="menuStyle" class="menu">
            <div v-for="(menuItem, index) in menuItems" :key="index" class="menu-item" @click="handleClick(menuItem)">
                {{ menuItem }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { openPdfInWPS } from '../lib/openFile';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            menuVisible: false,
            menuTop: 0,
            menuLeft: 0,
            menuItems: ['菜单项1', '菜单项2', 'Open With WPS'],
        };
    },
    methods: {
        onContextmenu(event: { clientY: any; clientX: any; }) {
            this.menuVisible = true;
            this.menuTop = event.clientY;
            this.menuLeft = event.clientX;
        },
        handleClick(menuItem: string) {
            console.log('点击了菜单项：', menuItem);
            if (menuItem=='Open With WPS') {
                openPdfInWPS("E:/Paper/DeepLearning/RNN-LSTM.pdf");
            }
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
    mounted() {
        // 监听页面的点击事件，隐藏右键菜单
        document.addEventListener('click', () => {
            this.menuVisible = false;
        });
    },
});
</script>
  
<style scoped lang="scss">
.menu {
    position: fixed;
    z-index: 9999;
    background-color: #383838;
    /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
    border-radius: 4px;
    font-size: 14px;
    padding: 4px;
}

.menu-item {
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
}

.menu-item:hover {
    background-color: #4b4b4b;
}
</style>
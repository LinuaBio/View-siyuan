<template>
  <ColumnLayout :leftWidth="'72%'" :rightWidth="'26%'">
  <template v-slot:left>
    <Waterfall :loadProps="loadProps" :crossOrigin="false" :animationEffect="'fadeInUp'" :backgroundColor="'#00000000'"
        :breakpoints="breakpoints" :list="images">
        <template #item="{ item, index }">
          <div class="card">
            <!-- <img :src="item.url" :alt="item.alt" /> -->
            <LazyImg :url="item.url" @mousedown="console.log(index)" />
          </div>
        </template>
      </Waterfall>
  </template>
  <template v-slot:right>
    <!-- 右边内容 -->
  </template>
</ColumnLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import ColumnLayout from '@/components/tool/TwoColumns.vue'
interface Image {
  id: number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}
export default defineComponent({
  components: {
    Waterfall, LazyImg, ColumnLayout
  },
  data: () => {
    return {
      loadProps: {
        loading: "@assets/loading.svg",
        error: "@assets/loadError.svg"
      },
      images: generateImages(20),
      breakpoints: {
        1200: { //当屏幕宽度小于等于1200
          rowPerView: 4,
        },
        800: { //当屏幕宽度小于等于800
          rowPerView: 3,
        },
        500: { //当屏幕宽度小于等于500
          rowPerView: 2,
        }
      }
    }
  },
})

function generateImages(numOfImages: number) {
  const images: Image[] = [];
  for (let i = 1; i <= numOfImages; i++) {
    const width = Math.floor(Math.random() * 500) + 250; // 随机生成宽度，取值范围为 [250, 750]
    const height = Math.floor(Math.random() * 500) + 200; // 随机生成高度，取值范围为 [200, 700]
    const url = `https://via.placeholder.com/${width}x${height}`; // 根据宽度和高度生成图片 URL
    const alt = 'placeholder image';
    images.push({ id: i, url, alt, width: width, height: height });
  }
  return images;
}
</script>

<style lang="scss">
// img {
//   width: 100%;
//   height: auto;
//   border-radius: 5px;
// }
</style>

<!-- <template>
  <div class="image-grid masonry">
    <div class="image-item" v-for="image in images" :key="image.id">
      <img :src="image.url" :alt="image.alt" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Image {
  id: string;
  url: string;
  alt: string;
  width?:number;
  height?:number;
}

const images: Image[] = generateImages(40);

export default defineComponent({
  components: {
    
  },
  data: () => {
    return {
      images: images
    }
  },
})

function generateImages(numOfImages: number) {
  const images = [];
  for (let i = 1; i <= numOfImages; i++) {
    const width = Math.floor(Math.random() * 500) + 250; // 随机生成宽度，取值范围为 [250, 750]
    const height = Math.floor(Math.random() * 500) + 200; // 随机生成高度，取值范围为 [200, 700]
    const url = `https://via.placeholder.com/${width}x${height}`; // 根据宽度和高度生成图片 URL
    const alt = 'placeholder image';
    images.push({ id: i.toString(), url, alt, width:width,height:height });
  }
  return images;
}
</script>

<style scoped>
.image-grid {
  background: none;
}

.image-item {
  display: block;
  width: 100%;
  margin: 0 0 10px;
  /* 调整间距 */
  box-sizing: border-box;
}

.image-item>img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.masonry {
  column-count: 4;
  /* 列数为 4 */
  column-gap: 10px;
  /* 设置间距 */
}

.masonry .image-item {
  break-inside: avoid;
  /* 禁止图片被分割 */
}
</style> -->


<!-- <template>
  <div class="image-grid">
    <div class="column" v-for="(column, index) in columns" :key="index">
      <div class="image-item" v-for="image in column" :key="image.id">
        <div class="wrapper" :style="{ paddingBottom: ((image.height / image.width) * 100) + '%' }">
          <img :src="image.url" :alt="image.alt" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Image {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

const images: Image[] = generateImages(20);
const columnCount = 4; // 列数

export default defineComponent({
  components: {
      
  },
  data: () => {
    return {
      columns: splitIntoColumns(images, columnCount)
    }
  },
})

function generateImages(numOfImages: number) {
  const images = [];
  for (let i = 1; i <= numOfImages; i++) {
    const width = Math.floor(Math.random() * 500) + 250; // 随机生成宽度，取值范围为 [250, 750]
    const height = Math.floor(Math.random() * 500) + 200; // 随机生成高度，取值范围为 [200, 700]
    const aspectRatio = width / height; // 计算宽高比
    const url = `https://via.placeholder.com/${width}x${height}`; // 根据宽度和高度生成图片 URL
    const alt = 'placeholder image';
    images.push({ id: i.toString(), url, alt, width: width, height: height, aspectRatio: aspectRatio });
  }
  return images;
}

function splitIntoColumns(images: Image[], count: number) {
  const columns: any[][] = Array(count).fill(null).map(() => []);
  const columnHeights = Array(count).fill(0);
  const dp = Array(count).fill(0);
  dp[0] = images[0].height;
  for (let i = 1; i < images.length; i++) {
    const image = images[i];
    let minHeight = Number.MAX_VALUE;
    for (let j = 0; j < count; j++) {
      dp[j] = Math.min(dp[j], columnHeights[j]) + image.height;
      minHeight = Math.min(minHeight, dp[j]);
    }
    let columnIndex = 0;
    for (let j = 1; j < count; j++) {
      if (dp[j] < dp[columnIndex]) {
        columnIndex = j;
      }
    }
    columns[columnIndex].push(image);
    columnHeights[columnIndex] += image.height;
    for (let j = 0; j < columnIndex; j++) {
      dp[j] = columnHeights[j];
    }
    for (let j = columnIndex + 1; j < count; j++) {
      dp[j] = columnHeights[j];
    }
  }
  return columns;
}
</script>

<style scoped>
.image-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -10px 0 0;
}

.column {
  flex-basis: calc(100% / 4 - 20px);
  /* 每列宽度，把 4 改成 columnCount */
  margin: 10px;
}

.image-item {
  margin-bottom: 10px;
  box-sizing: border-box;
}

.wrapper {
  width: 100%;
  height: 0;
  position: relative;
}

.wrapper img {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}
</style> -->
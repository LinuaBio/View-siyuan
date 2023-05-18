interface Window {
    // 假设要使用 Options API，请设置为 true，否则设置为 false
    __VUE_OPTIONS_API__?: boolean;
    // 启用或禁用 Vue 3 开发工具扩展（仅在开发模式下使用）
    __VUE_PROD_DEVTOOLS__?: boolean;
  }

  interface PaperItem {
    title?: string;
    authors?: string[];
    abstract?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    date?: string;
    language?: string;
    issn?: string;
    link?: string;
    accessed?: string;
    copyright?: string;
    addDate?: string;
    modDate?: string;
    [key: string]: string | string[] | undefined;
}

interface FileInfo {
  name: string;
  dir: string;
  ext: string;
  size: number;
}

// interface FileGroups {
//   [key: string]: string[];
// }

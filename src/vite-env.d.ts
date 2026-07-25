/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-extraneous-class */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'kuroshiro' {
    export default class Kuroshiro {
        init(analyzer: any): Promise<void>;
        convert(text: string, options?: any): Promise<string>;
    }
}

declare module 'kuroshiro-analyzer-kuromoji' {
    export default class KuromojiAnalyzer {
        constructor(options?: { dictPath: string });
    }
}

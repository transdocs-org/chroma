import type {Metadata, Viewport} from 'next';
import './globals.css';
import React from 'react';
import ThemeProvider from '@/components/ui/theme-provider';
import {Inter} from 'next/font/google';
import Header from '@/components/header/header';
import PostHogProvider from '@/components/posthog/posthog-provider';
import CloudSignUp from '@/components/header/cloud-signup';
import HeaderNav from '@/components/header/header-nav';

export const metadata: Metadata = {
  title: 'Chroma 文档 | Chroma 中文文档',
  description: 'ChromaDB 的文档，ChromaDB 中文文档，每天定时同步官网更新。',
  openGraph: {
    title: 'Chroma 文档',
    description: 'ChromaDB 的文档',
    siteName: 'Chroma 文档',
    url: 'https://docs.trychroma.com',
    images: [
      {
        url: 'https://docs.trychroma.com/og.png', // 必须是绝对路径
        width: 2400,
        height: 1256
      }
    ],
    locale: 'zh_CN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chroma 文档',
    description: 'ChromaDB 的文档',
    site: 'trychroma',
    siteId: '1507488634458439685',
    creator: '@trychroma',
    creatorId: '1507488634458439685',
    images: ['https://docs.trychroma.com/og.png'] // 必须是绝对路径
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

const inter = Inter({subsets: ['latin']});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  function baiduTongji() {
    return {
      __html: `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?2fe1095387fd2f2c25892a4fde2f0cc2";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      `
    };
  }

  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={baiduTongji()} />
        <script defer src='https://cdn.jsdmirror.com/gh/transdocs-org/cdn/transdocs-info-modal.js' />
      </head>
      <body data-invert-bg='true' className={`${inter.className} antialiased bg-white dark:bg-black bg-[url(/composite_noise.jpg)] bg-repeat relative text-[#27201C] dark:text-white dark:backdrop-invert`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <PostHogProvider>
            {/* 主要页面结构在此完成：
                首先将页面设为一个大的 flex 列容器 */}
            <div className='relative z-10 flex flex-col h-dvh overflow-hidden'>
              {/* 防止头部区域缩小 */}
              <div className='shrink-0'>
                <Header />
                <HeaderNav />
              </div>
              {/* 使此容器占据剩余空间并隐藏溢出内容
                  侧边栏和主要内容将在此渲染并填满可用空间，各自处理滚动 */}
              <div className='flex-1 overflow-y-hidden h-full'>{children}</div>
            </div>
            {/* 注册云服务组件可以放在这里，因为它使用固定定位 */}
            <CloudSignUp />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
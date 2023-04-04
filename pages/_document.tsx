import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from "next/script";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {' '}
            {initialProps.styles} {sheet.getStyleElement()}{' '}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="ko">
        <Head />

        <body>
          <Main />
          <NextScript />
          <Script
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=01304b70ae975ce0928db64367e0034b&libraries=services,clusterer,drawing&autoload=false"
            strategy="beforeInteractive"
          />
        </body>
      </Html>
    );
  }
}

import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
import { loadDefaultJapaneseParser } from "budoux";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);
const noto = readFileSync(
  `${__dirname}/../_fonts/NotoSansJP-Bold.woff2`
).toString("base64");

const icon = readFileSync(`${__dirname}/../_images/icon.png`).toString(
  "base64"
);

function getCss(fontSize: string) {
  let foreground = "#333333";

  return `
    @font-face {
        font-family: 'Noto';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${noto}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background-size: contain;
        background-image: linear-gradient(to bottom right, #22d3ee, #2563eb);
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Noto', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: 700;
        color: ${foreground};
        line-height: 1.3;
        max-width: 1000px
    }
    
    .grid {
        background-color: #f8fafc;
        display: grid;
        place-items: center;
        width: 1100px;
        height: 530px;
        border-radius: 30px;
        position: relative;
    }
    
    .icon {
        position: absolute;
        right: 30px;
        bottom: 30px;
        display: block;
        width: 80px;
        height: 80px;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, md, fontSize } = parsedReq;
  const parser = loadDefaultJapaneseParser();
  const title = parser.translateHTMLString(text);
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(fontSize)}
    </style>
    <body>
        <div class="grid">
            <div class="heading">${emojify(
              md ? marked(title) : sanitizeHtml(title)
            )}
            <img class='icon' src=data:image/png;base64,${icon} alt='icon' />
            </div>
        </div>
    </body>
</html>`;
}

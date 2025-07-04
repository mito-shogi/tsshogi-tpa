## @mito-shogi/tsshogi-tpa

独自形式で配布されている棋譜データをtsshogiのRecord型に変換するためのライブラリです.

### 対応データ

- [x] 詰将棋パラダイス

### 導入

GitHub Package Registryを利用しているので`.npmrc`または`npm login`が必要になります

```zsh
# .npmrc
registry=https://npm.pkg.github.com/mito-shogi
```

インストールは以下のコマンドをご利用ください

```zsh
# npm
npm install @mito-shogi/tsshogi-tpa

# yarn
yarn add @mito-shogi/tsshogi-tpa

# pnpm
pnpm install @mito-shogi/tsshogi-tpa

# bun
bun add @mito-shogi/tsshogi-tpa
```

### 使い方

```ts
import { importTPA } from '@tsshogi/kanna'
import { Record } from 'tsshogi'

const text: string = "" // 詰将棋パラダイスのテキストデータ
const record: Record | Error = importTPA(text)
if (record instanceof Error) return
// recordを使って処理
```

この結果、以下のようなレスポンスが得られます

```zsh
表題：ﾁｮｺﾏｶ銀
作者：須藤大輔
発表誌：詰将棋パラダイス
発表年月：2010/07/21
レベル：6
ポイント：20
ヒント：ﾁｮｺﾏｶ銀
手数：11
作品名：詰将棋パラダイス
作品番号：99
後手の持駒：歩十八　香四　桂二　銀二　金三　角　飛二
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
| ・ ・ ・ ・ ・ ・ ・ ・ ・|一
| ・ ・ ・ ・ ・ ・ ・ ・ ・|二
| ・ ・ ・ ・ ・ ・ ・ ・ ・|三
| ・ ・ ・ ・ ・ ・ 馬 銀v玉|四
| ・ ・ ・ ・ ・ ・v金 ・v銀|五
| ・ ・ ・ ・ ・ ・ 桂 ・ ・|六
| ・ ・ ・ ・ ・ ・ ・ ・ ・|七
| ・ ・ ・ ・ ・ ・ ・ ・ ・|八
| ・ ・ ・ ・ ・ ・ ・ ・ ・|九
+---------------------------+
先手の持駒：桂
先手番
手数----指手---------消費時間--
```

> 指し手も出力されますが、ネタバレ防止のためにここでは記載していません

複数の詰み手順がある場合、それら全てを出力します。

KIF形式以外の出力をした場合、カスタムメタデータは失われてしまいます。

## 参考

- [tsshogi](https://github.com/sunfish-shogi/tsshogi)

## ライセンス

[MIT License](https://github.com/tsshogi/kanna/blob/main/LICENSE)

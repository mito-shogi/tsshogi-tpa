## @mito-shogi/tsshogi-tpa

本ライブラリは、詰将棋パラダイスなどで配布されている独自形式の棋譜データを、tsshogiのRecord型へとスマートに変換するためのものです。将棋の記録管理や解析を、より洗練された形で行いたい方におすすめです。

### 対応データ

- [x] 詰将棋パラダイス

### 導入方法

GitHub Package Registryを利用しているため、事前に`.npmrc`の設定または`npm login`が必要です。

```zsh
# .npmrc
registry=https://npm.pkg.github.com/mito-shogi
```

インストールは以下のコマンドからお選びいただけます。

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
import { importTPA } from '@mito-shogi/tsshogi-tpa'
import { Record } from 'tsshogi'

const text: string = "" // 詰将棋パラダイスのテキストデータ
const record: Record | Error = importTPA(text)
if (record instanceof Error) return
// recordを使って処理
```

このようにして、詰将棋パラダイスのテキストデータをRecord型へ変換できます。

#### 変換結果の例

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

> ※ 指し手も出力されますが、ネタバレ防止のためここでは省略しています。

複数の詰み手順が存在する場合、それらすべてを出力します。

KIF形式以外で出力した場合、カスタムメタデータは保持されませんのでご注意ください。

## 参考文献

- [tsshogi](https://github.com/sunfish-shogi/tsshogi)

## ライセンス

[MIT License](https://github.com/tsshogi/kanna/blob/main/LICENSE)

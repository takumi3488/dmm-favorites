# dmm-favorites

##　概要

DMMのお気に入り商品から割引や高還元セール中のものを抜き取って、還元ポイントが高い順に出力するツールです。全部買う場合、一番上から買っていくと購入金額が最小になります。

## 対応状況

:white_large_square:動画

:white_check_mark:電子書籍

:white_large_square:PCゲーム/ソフトウェア

:white_large_square:DVD／CDレンタル

:white_large_square:通販

:white_large_square:同人

:white_large_square:ライブチャット

＊動画以外に今後対応する可能性は低いです。

## 使い方
前提としてyarnがインストールされている必要があります。
1. yarnコマンドを実行し、依存ライブラリをインストールします。
2. auth.tsを作成し、次のように記述します。
```auth.ts
const auth = {
  email: DMMの登録メールアドレス,
  password: DMMの登録パスワード,
};

export default auth;
```
3. yarn devを実行すれば完了です。

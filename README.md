This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## CI/CD Workflow

このプロジェクトでは GitHub Actions を使用した CI/CD ワークフローが設定されています。

### ワークフローの概要

1.  **Pull Request 作成/更新時 (`build-pr` ジョブ)**
    * `main` ブランチへの PR が作成または更新された時に実行されます。
    * 静的サイトのビルド（`pnpm build`）を行い、生成された資産（`out/` ディレクトリ）を GitHub のアーティファクトとして保存します。
    * アーティファクトにはユニークなビルドタグ（ブランチ名 + 実行ID）が付与されます。
    * ビルド完了後、PR にビルドタグがコメントとして投稿されます。

2.  **メインブランチへのマージ時 (`release-and-deploy` ジョブ)**
    * `main` ブランチにプッシュ（PR のマージ）された時に実行されます。
    * マージされたコミットに関連付けられた PR を特定し、その PR で作成された最新の成功ビルド資産を自動的にダウンロードします。
    * タイムスタンプ付きの GitHub Release を作成し、ダウンロードした資産を `build-assets.zip` としてアップロードします。

3.  **S3 へのデプロイ (`deploy-to-s3` ジョブ)**
    * リリース作成完了後に実行されます。
    * **人間の承認が必要**なステップとして設定されています（`production` 環境）。
    * 承認後、GitHub Release から資産をダウンロードし、S3 バケット `gekal-nextjs-template-sample` に同期します。

### 事前準備と設定

このワークフローを動作させるには、リポジトリに以下の設定が必要です。

1.  **Environments の作成**
    * GitHub リポジトリの `Settings` > `Environments` で `production` という名前の環境を作成してください。
    * `Required reviewers` を有効にし、承認者を設定することで、S3 デプロイ前の承認フローが有効になります。

2.  **Secrets の登録**
    * `Settings` > `Secrets and variables` > `Actions` に以下の Secrets を登録してください。
        * `AWS_ACCESS_KEY_ID`: AWS アクセスキー
        * `AWS_SECRET_ACCESS_KEY`: AWS シークレットアクセスキー

3.  **Permissions の設定**
    * `Settings` > `Actions` > `General` の `Workflow permissions` が `Read and write permissions` になっていることを確認してください。

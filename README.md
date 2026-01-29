This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
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

1.  **Pull Request 作成/更新時 (`ci.yml`)**
    * `main` ブランチへの PR が作成または更新された時に実行されます。
    * ジョブ `check-build`: 静的サイトのビルド（`pnpm build`）が正常に通るかを確認します。

2.  **メインブランチへのマージ時 (`release.yml`)**
    * `main` ブランチにプッシュ（PR のマージ）された時に実行されます。
    * **ビルドとリリース作成 (`build` ジョブ)**:
        * タイムスタンプ（日本時間）とハッシュを組み合わせたタグ（例: `v2026.01.29-d3fa6d4`）を自動生成します。
        * プロダクションビルドを実行し、生成された資産（`out/` ディレクトリ）を `build-assets.zip` として GitHub Release にアップロードします。
        * また、後続のデプロイジョブのためにアーティファクトとして保存します。
    * **S3 へのデプロイ (`deploy` ジョブ)**:
        * **人間の承認が必要**なステップとして設定されています（`production` 環境）。
        * 承認後、ビルド済み資産を S3 バケット（`AWS_S3_BUCKET_NAME` 変数で指定）に同期します。

### 事前準備と設定

このワークフローを動作させるには、リポジトリに以下の設定が必要です。

1.  **Environments の作成**
    * GitHub リポジトリの `Settings` > `Environments` で `production` という名前の環境を作成してください。
    * `Required reviewers` を有効にし、承認者を設定することで、S3 デプロイ前の承認フローが有効になります。

2.  **Secrets と Variables の登録**
    * `Settings` > `Secrets and variables` > `Actions` に以下を登録してください。
    * **Secrets**:
        * `AWS_ACCESS_KEY_ID`: AWS アクセスキー
        * `AWS_SECRET_ACCESS_KEY`: AWS シークレットアクセスキー
    * **Variables**:
        * `AWS_S3_BUCKET_NAME`: デプロイ先の S3 バケット名 (例: `gekal-nextjs-template-sample`)

3.  **Permissions の設定**
    * `Settings` > `Actions` > `General` の `Workflow permissions` が `Read and write permissions` になっていることを確認してください（リリース作成に必要です）。

#!/bin/bash

# エラーが発生したら即停止する設定
set -e

# ==========================================
# 設定値 (必要に応じて変更してください)
# ==========================================
BUCKET_NAME="gekal-nextjs-template-sample"
REGION="ap-northeast-1"
IAM_USER_NAME="github-actions-deployer"

echo "=== AWS Setup Start ==="
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"
echo "User:   $IAM_USER_NAME"
echo "======================="

# ------------------------------------------
# 1. S3バケットの作成
# ------------------------------------------
echo "[1/6] Creating S3 bucket..."
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

# ------------------------------------------
# 2. パブリックアクセスのブロックを解除
# ------------------------------------------
echo "[2/6] Disabling Block Public Access..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# ------------------------------------------
# 3. 静的ウェブサイトホスティングの有効化
# ------------------------------------------
echo "[3/6] Enabling Static Website Hosting..."
aws s3 website s3://$BUCKET_NAME/ \
    --index-document index.html \
    --error-document 404.html

# ------------------------------------------
# 4. バケットポリシーの適用 (Web公開)
# ------------------------------------------
echo "[4/6] Applying Bucket Policy..."
cat <<EOF > bucket-policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file://bucket-policy.json

rm bucket-policy.json

# ------------------------------------------
# 5. IAMユーザーと権限の作成
# ------------------------------------------
echo "[5/6] Creating IAM User and Policy..."

# ユーザーが存在しない場合のみ作成（エラー回避）
if ! aws iam get-user --user-name $IAM_USER_NAME >/dev/null 2>&1; then
    aws iam create-user --user-name $IAM_USER_NAME
else
    echo "User $IAM_USER_NAME already exists. Skipping creation."
fi

# ポリシー作成と適用
cat <<EOF > deploy-policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListBucketForSync",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}"
        },
        {
            "Sid": "UploadAndDeleteContent",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws iam put-user-policy \
    --user-name $IAM_USER_NAME \
    --policy-name DeployToGekalSamplePolicy \
    --policy-document file://deploy-policy.json

rm deploy-policy.json

# ------------------------------------------
# 6. アクセスキーの発行と完了
# ------------------------------------------
echo "[6/6] Creating Access Keys..."
echo ""
echo "!!! IMPORTANT: Save the following keys immediately !!!"
echo "-----------------------------------------------------"

aws iam create-access-key --user-name $IAM_USER_NAME

echo "-----------------------------------------------------"
echo ""
echo "=== Setup Completed Successfully! ==="
echo "Website URL: http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

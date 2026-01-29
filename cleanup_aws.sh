#!/bin/bash

# ==========================================
# 設定値 (setup_aws.sh と同じもの)
# ==========================================
BUCKET_NAME="gekal-nextjs-template-sample"
IAM_USER_NAME="github-actions-deployer"
POLICY_NAME="DeployToGekalSamplePolicy"

echo "!!! WARNING !!!"
echo "This script will PERMANENTLY DELETE:"
echo " - S3 Bucket: $BUCKET_NAME (and all files inside)"
echo " - IAM User:  $IAM_USER_NAME"
echo ""
read -p "Are you sure you want to proceed? (y/N): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "=== AWS Cleanup Start ==="

# ------------------------------------------
# 1. IAMユーザーの削除
# ------------------------------------------
echo "[1/3] Cleaning up IAM User: $IAM_USER_NAME..."

# IAMユーザーが存在するか確認
if aws iam get-user --user-name $IAM_USER_NAME >/dev/null 2>&1; then

    # 1-1. アクセスキーの削除 (キーがあるとユーザーを削除できないため)
    echo "  - Deleting Access Keys..."
    KEYS=$(aws iam list-access-keys --user-name $IAM_USER_NAME --query 'AccessKeyMetadata[].AccessKeyId' --output text)

    for KEY in $KEYS; do
        aws iam delete-access-key --user-name $IAM_USER_NAME --access-key-id $KEY
        echo "    Deleted Key: $KEY"
    done

    # 1-2. インラインポリシーの削除
    echo "  - Deleting User Policy..."
    aws iam delete-user-policy --user-name $IAM_USER_NAME --policy-name $POLICY_NAME || echo "    Policy not found or already deleted."

    # 1-3. ユーザー自体の削除
    echo "  - Deleting User..."
    aws iam delete-user --user-name $IAM_USER_NAME
    echo "  Done."

else
    echo "  User $IAM_USER_NAME does not exist. Skipping."
fi

# ------------------------------------------
# 2. S3バケットの削除
# ------------------------------------------
echo "[2/3] Cleaning up S3 Bucket: $BUCKET_NAME..."

# バケットが存在するか確認
if aws s3api head-bucket --bucket $BUCKET_NAME >/dev/null 2>&1; then
    # rb (remove bucket) コマンドに --force を付けると、中身を空にしてからバケットを削除してくれる
    aws s3 rb s3://$BUCKET_NAME --force
    echo "  Bucket deleted successfully."
else
    echo "  Bucket $BUCKET_NAME does not exist. Skipping."
fi

echo "-----------------------------------------------------"
echo "=== Cleanup Completed Successfully! ==="

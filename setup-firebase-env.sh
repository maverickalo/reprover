#!/bin/bash

echo "Firebase Setup for Vercel"
echo "========================="
echo ""
echo "This script will help you add Firebase environment variables to Vercel."
echo "You'll need the values from your Firebase service account JSON file."
echo ""

# Get Firebase Project ID
read -p "Enter your Firebase Project ID (e.g., reprover-xxxxx): " project_id

# Get Firebase Client Email
read -p "Enter your Firebase Client Email: " client_email

# Get Firebase Private Key
echo ""
echo "For the private key, paste the ENTIRE key including:"
echo "-----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----"
echo "Press Enter twice when done:"
echo ""
private_key=""
while IFS= read -r line; do
    if [[ -z "$line" ]]; then
        break
    fi
    if [[ -z "$private_key" ]]; then
        private_key="$line"
    else
        private_key="$private_key\n$line"
    fi
done

echo ""
echo "Adding environment variables to Vercel..."
echo ""

# Add to Vercel
vercel env add FIREBASE_PROJECT_ID production <<< "$project_id"
vercel env add FIREBASE_CLIENT_EMAIL production <<< "$client_email"
vercel env add FIREBASE_PRIVATE_KEY production <<< "$private_key"

echo ""
echo "✅ Environment variables added to Vercel!"
echo ""
echo "Next steps:"
echo "1. Redeploy your project: vercel --prod"
echo "2. Your Firebase endpoints will now work!"
echo ""
echo "Test your endpoints:"
echo "- Log workout: POST https://www.reprover.dev/api/log-workout"
echo "- Get history: GET https://www.reprover.dev/api/history?exercise=push-ups"
#!/bin/bash

# Deployment script for Reprover app to Heroku

echo "🚀 Starting Heroku deployment process..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "📝 Please log in to Heroku:"
    heroku login
fi

# Check if app name is provided
if [ -z "$1" ]; then
    echo "❌ Please provide an app name:"
    echo "   ./deploy-to-heroku.sh your-app-name"
    exit 1
fi

APP_NAME=$1

echo "📱 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Add git remote for Heroku
git remote add heroku https://git.heroku.com/$APP_NAME.git 2>/dev/null || echo "Heroku remote already exists"

echo "🔧 Setting environment variables..."
echo "Please enter your environment variables:"

read -p "OPENAI_API_KEY: " OPENAI_API_KEY
read -p "FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
read -p "FIREBASE_CLIENT_EMAIL: " FIREBASE_CLIENT_EMAIL
echo "FIREBASE_PRIVATE_KEY (paste the entire private key including \\n characters):"
read FIREBASE_PRIVATE_KEY

# Set environment variables
heroku config:set OPENAI_API_KEY="$OPENAI_API_KEY" --app $APP_NAME
heroku config:set FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" --app $APP_NAME
heroku config:set FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL" --app $APP_NAME
heroku config:set FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY" --app $APP_NAME
heroku config:set NODE_ENV="production" --app $APP_NAME

echo "📦 Deploying to Heroku..."
git push heroku main

echo "✅ Deployment complete!"
echo "🌐 Your app is available at: https://$APP_NAME.herokuapp.com"
echo ""
echo "📊 To view logs: heroku logs --tail --app $APP_NAME"
echo "🔧 To manage app: heroku dashboard --app $APP_NAME"
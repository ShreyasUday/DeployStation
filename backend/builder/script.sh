#!/bin/sh
git clone --branch $2 $1 repo
cd repo

# 1. Install dependencies if package.json exists
if [ -f "package.json" ]; then
    npm install
    npm run build --if-present
fi

# 2. Auto-patch localhost -> 0.0.0.0
export NODE_OPTIONS="--require /app/patch.cjs"

# 3. Smart Start: Try multiple entry points in order of priority
if [ -f "package.json" ] && grep -q '"start"' package.json; then
    npm start
elif [ -f "index.js" ]; then
    node index.js
elif [ -f "server.js" ]; then
    node server.js
elif [ -f "app.js" ]; then
    node app.js
elif [ -f "src/index.js" ]; then
    node src/index.js
elif [ -f "src/server.js" ]; then
    node src/server.js
else
    echo "Error: No entry point found!"
    echo "Add a 'start' script to package.json, or use index.js/server.js/app.js"
    exit 1
fi
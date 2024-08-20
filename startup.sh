#!/bin/bash
APIKEY=$1

cat << EOF > /app/config/config.js
// apikey
export const apiKey = "${APIKEY}"
EOF

node ./server/app.js
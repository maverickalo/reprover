#!/bin/bash

echo "Adding Firebase credentials to Vercel..."
echo ""

# Add environment variables to Vercel
vercel env add FIREBASE_PROJECT_ID production < /dev/stdin <<< "reprover-aae0b"
vercel env add FIREBASE_CLIENT_EMAIL production < /dev/stdin <<< "firebase-adminsdk-fbsvc@reprover-aae0b.iam.gserviceaccount.com"

# For the private key, we need to handle it carefully
cat << 'EOF' | vercel env add FIREBASE_PRIVATE_KEY production
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC3i03vSR0opVcO
5OoVT/NZUn5CtRrTheVxDRJXn2GvKzVso+5Ow9M7T7az692rLPkFdVhk3AWNzGrc
559vh618+cg2zxh+siNlgJ62ZHxb0CtRn8kpcp/xQwJ4wsBjwUVxCfWgL4bIZ4WZ
1kdiVjUJrsNz3E5BR5owiwSEVAYiVlAnVUm63pr6gS9RecdCFejMXTbyfYvYC6nY
poDz8AaEDl9Ud8rNrkvVab1AgdDPWEib8EsGFSqD28K0bUILDQdGgprhtkMEqJSJ
F8IZG8HHB8qvhUv2Lq9mRDMLkHWSs98SDhwsfreAuq9h33IthCrNdIucUoLgL75/
bTgV1jV1AgMBAAECggEAIJWhzp0NiOl/gOSpXQK+WklvomKaAlrXPqB6NOWV9z3l
xGV++WtA/Rrb/emeBxVbGTm5qWA5OTEE+LZDIw70gQcsIPTXrahs6chxhMJmpHsa
sak7EnlnxTJnBi7W7m7Bp/2DZn6BgGMGgCbfMelJjbBBwTgniWXPjRYlBWQQWbho
3eCj5B2GNC5sAh2epKCNJ+c+Q9ETgocJe99tnxB9Ip1mTg9ISnfKCa5UFD/lXYOE
48BryJapqcJnXI5kPmKL8n7QHTSPNWIcl2of7smKsT+/WdEWfTpb1p6zMnGb1Me8
xOEk4IDFPPGA5BKTDM9/wY+NtijgN48E2i4fw6EcqQKBgQD4pqk9dkZptTYWfhw5
zIJGborS6ePgxI346wsI2O4FKy8ncI20/oW9/t+Bjf+09c9AyR449hb9sdnLNFD9
TBgKF/5BdE9D5HpcTjhHUTzGOUgIzNnonaFymZJALU9UgV1AHjwxVJ/4KkKH3YKk
YACWw8Fm+YUttpXZhwJeS8Ga6QKBgQC8+AhwNhA3s7lRLLS9ThOyX+zjxV+ZvEZ9
n+DBxDE/NkKoScwvs4glbFheWbLvwIrXqfQ++0L9VX8XCYT4Db/ANG+CkTElYRfv
xfocttG4gm9wQ4GaYSy8dM2WrBd7ew+/fKMKKra+/fTui0F3yjZidUyDz5qXQW+u
+0Rt29yWrQKBgQCHtK35VWvolXYHoJxXDz6qofoyUmSEb8HscJt9IKgHOiJqLAur
FJ55q3jghFditCWA/kL4Y5b4rvBm7w6kr7sPBzlFD+2S6Ee/yRD+G2BH70tZQjRL
uHw8x4QCcrgxLsluDRJc+gq0rpvQ+xwqChtILV6IjPYalOQD7KNmQ4JOwQKBgQCJ
YFfiG6uWkxW6KaILrWMsXgg9XhOuE+27Diu7MgILTksPRPcoBoCHlEh57wPiwDsv
peJmlwuQWENYYBdGrdgkxvn6FcuAvSFFssutbErytACHwMvLi7GWH+QGEX3Qyxob
v2RX082e88jIUnx5tYvr8BJ8EMT2CSBEOW753shy0QKBgQDEOr3Qm4St9O35zRCX
z5wc/xSmdcE14L6N3EodZjuTFRZ8PJebvzplaUUsNLGERZUSE1dQ9EvanLPRZdlJ
Tq9AA0LBepunxVzRD7Td4evc/Qvc4tPDOPodOuPnICn7tKxzFd7m+0MUpmn4w/K5
L5W2dH99qnPMW31JNe6+7SejdQ==
-----END PRIVATE KEY-----
EOF

echo ""
echo "✅ Firebase credentials added to Vercel!"
echo ""
echo "Now redeploy your project to activate Firebase:"
echo "  vercel --prod"
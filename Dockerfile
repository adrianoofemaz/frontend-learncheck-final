FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# ✅ SERVE hasil build, BUKAN dev
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
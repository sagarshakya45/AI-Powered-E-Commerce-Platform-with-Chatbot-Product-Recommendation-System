FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# By default, start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]

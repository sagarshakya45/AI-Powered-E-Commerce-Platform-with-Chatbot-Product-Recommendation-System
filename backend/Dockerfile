FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Generate Prisma client before starting
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

# By default, start the Next.js development server
CMD ["npm", "run", "dev"]

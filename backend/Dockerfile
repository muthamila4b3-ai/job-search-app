FROM node:18-alpine

WORKDIR /app

# Copy backend package files from the repo root context
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy only backend source files into the image
COPY backend .

EXPOSE 5000

CMD ["npm", "start"]

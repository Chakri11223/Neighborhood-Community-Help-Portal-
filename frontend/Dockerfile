# Stage 1: Build the Angular application
FROM node:18-alpine as build-step

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build-step /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx config if we had one, but standard is fine for now
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

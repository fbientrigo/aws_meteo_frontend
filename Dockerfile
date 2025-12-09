# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or bun.lockb if you use bun)
COPY package.json package-lock.json* bun.lockb* ./

# Install dependencies
# Note: If you are using bun, you might want to install bun in the container or use a bun image.
# For now, we'll stick to npm/node for broad compatibility, but if you strictly use bun, let me know.
# We'll use npm ci for reliable builds if lockfile exists, otherwise npm install.
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Use official Node.js runtime as base image
FROM node:18-alpine

# Install PM2 globally
RUN npm install -g pm2

# Install Nginx
RUN apk add --no-cache nginx

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY src ./src

# Create directory for Nginx configuration
RUN mkdir -p /etc/nginx/conf.d

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create pm2 ecosystem config file
COPY ecosystem.config.cjs ./ecosystem.config.cjs

# Expose ports
EXPOSE 3000 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start both Nginx and PM2
CMD ["sh", "-c", "nginx && pm2-runtime start ecosystem.config.cjs"]

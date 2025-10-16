# Multi-stage Dockerfile for Angular Frontend
# Stage 1: Build the Angular application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Copy built application from builder stage
COPY --from=builder /app/dist/productify-frontend /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Create health check file
RUN echo "OK" > /usr/share/nginx/html/health

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html

# Expose port (Railway will set PORT dynamically)
EXPOSE $PORT

# Start Nginx with dynamic port
CMD ["/start.sh"]

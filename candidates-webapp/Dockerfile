# Multi-stage build for Angular frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/candidates-webapp/browser /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S angular && \
    adduser -S angular -u 1001 -G angular

# Change ownership of nginx directories
RUN chown -R angular:angular /var/cache/nginx && \
    chown -R angular:angular /var/log/nginx && \
    chown -R angular:angular /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R angular:angular /var/run/nginx.pid

USER angular

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
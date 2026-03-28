# Use official Node.js 18 image on Alpine Linux
# Alpine = small (~170MB), secure, production-ready
FROM node:18-alpine

# Set working directory inside container
# All subsequent commands run from /app
WORKDIR /app

# Copy package files first (for layer caching)
# If dependencies don't change, this layer is cached
# Avoids re-running npm ci on every code change
COPY package*.json ./

# Install dependencies using npm ci
# npm ci = clean install, faster and more reliable than npm install
# Installs exact versions from package-lock.json — deterministic builds
RUN npm ci

# Copy application source code
# Comes AFTER npm ci so code changes don't bust the dependency cache
COPY . .

# Expose port 5000
# Documents which port the app listens on inside the container
EXPOSE 5000

# Command to start the server
# Uses node directly (not nodemon) for production
CMD ["node", "server.js"]

# =============================================
# Stage 1: Build the React app
# =============================================
# Use Node.js 18 Alpine as the build environment
# Named "build" so Stage 2 can reference it with COPY --from=build
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST for layer caching
# If package.json / package-lock.json don't change, this layer is cached
# and npm ci won't re-run on every code change
COPY package*.json ./

# Install dependencies — clean, deterministic install from package-lock.json
RUN npm ci

# Copy the rest of the source code
# Comes AFTER npm ci so code changes don't bust the dependency cache
COPY . .

# Run Vite's production build
# Generates optimised, minified static files in /app/dist
RUN npm run build

# =============================================
# Stage 2: Serve with Nginx (production image)
# =============================================
# Start fresh — the heavy build stage is discarded after its outputs are used
# nginx:alpine is a tiny (~23 MB) web server image
FROM nginx:alpine

# Copy ONLY the built static files from Stage 1 into Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Replace Nginx's default config with our custom one (SPA fallback + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that Nginx serves on port 80
EXPOSE 80

# No CMD needed — nginx:alpine already starts Nginx automatically

FROM node:20-alpine AS build
# FROM: Use Node.js 20 on Alpine Linux as the base for the build stage.
# node:20-alpine is a lightweight image (~50MB) with everything needed to run npm.
# AS build: Name this stage "build" so we can copy artifacts from it in the next stage.

WORKDIR /app
# WORKDIR: Set /app as the working directory inside the container.
# All subsequent COPY and RUN commands execute relative to this path.

COPY package*.json ./
# COPY: Bring in package.json and package-lock.json first, before the rest of the source.
# Docker caches each layer — by copying dependency files separately, npm ci only re-runs
# when dependencies change, not on every source code edit. This speeds up rebuilds.

RUN npm ci
# RUN npm ci: Install exact dependency versions from package-lock.json.
# npm ci is preferred over npm install in CI/Docker because it's faster,
# deterministic, and fails if the lock file is out of sync with package.json.

COPY . .
# COPY: Now bring in the rest of the source code.
# This happens after npm ci so that source changes don't invalidate the dependency cache layer.

RUN npm run build
# RUN: Execute Vite's production build.
# This compiles TypeScript, bundles the React app, and outputs static files to /app/dist.

FROM nginx:alpine
# FROM: Start a second stage using a minimal nginx image.
# This is a multi-stage build — the final image only contains nginx + built static files,
# not Node.js or node_modules. This keeps the production image tiny (~25MB).

COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build: Pull the compiled static files from the build stage
# into nginx's default document root. Only the dist/ output is carried forward.

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY: Replace nginx's default site config with our custom one.
# Our nginx.conf handles SPA routing (try_files) and proxies /api/ to the backend.

EXPOSE 80
# EXPOSE: Document that this container serves HTTP on port 80.
# This is informational — the actual port mapping is done in docker-compose.yml.

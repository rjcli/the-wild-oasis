# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM deps AS builder

WORKDIR /app

COPY index.html vite.config.js .eslintrc.cjs .prettierrc ./
COPY public ./public
COPY src    ./src

# VITE_ vars must be available at build time so Vite can inline them.
# Pass them via --build-arg and expose as ARG → ENV.
ARG VITE_API_ORIGIN
ARG VITE_API_URL

ENV VITE_API_ORIGIN=$VITE_API_ORIGIN
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build


# ─── Stage 3: runner (nginx static server) ───────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for a React SPA (handles client-side routing)
COPY --from=builder /app/dist /usr/share/nginx/html

COPY <<"EOF" /etc/nginx/conf.d/default.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Try to serve the request file, or fall back to index.html for client-side routing
    location / {
        try_files $uri /index.html;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# =========================================================
# Royal Connect – Image Docker (site statique servi par Nginx)
# =========================================================
FROM nginx:1.27-alpine

# Métadonnées
LABEL maintainer="Royal Beauty <contact@royalbeauty.fr>"
LABEL description="Royal Connect – site statique servi par Nginx"

# Configuration Nginx personnalisée (gzip, cache, sécurité)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie du site statique
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY index.html services.html booking.html dashboard.html login.html ./
COPY css/ ./css/
COPY js/ ./js/
COPY images/ ./images/

# Droits de lecture
RUN chmod -R a+r /usr/share/nginx/html

EXPOSE 80

# Healthcheck simple
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

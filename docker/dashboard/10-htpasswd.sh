#!/bin/sh
set -eu

if [ -z "${DASHBOARD_USER:-}" ] || [ -z "${DASHBOARD_PASSWORD:-}" ]; then
  echo "DASHBOARD_USER and DASHBOARD_PASSWORD must be set (see .env.example)." >&2
  exit 1
fi

htpasswd -bcB /etc/nginx/.htpasswd "$DASHBOARD_USER" "$DASHBOARD_PASSWORD" >/dev/null 2>&1

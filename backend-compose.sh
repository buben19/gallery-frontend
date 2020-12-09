#!/bin/sh
# Start development version of fronten with production backend container.
exec docker-compose -f backend-config/docker-compose.yml $@

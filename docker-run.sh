#!/bin/sh
# Basic script to run ng docker container.
exec docker run -ti --rm --user $(id -u) -v $(pwd):/app ng $@

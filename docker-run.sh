#!/bin/sh
exec docker run -ti --rm --user $(id -u) -v $(pwd):/app ng $@

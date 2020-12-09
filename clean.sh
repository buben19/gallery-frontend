#!/bin/sh
set -e
echo "Removing temporary files..."
rm -rf node_modules dist
echo "Done."
exit $?

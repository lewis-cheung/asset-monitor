# /bin/bash

# Show npm version --help if missing version type
if [ -z "$1" ]; then
  npm version --help
  exit 1
fi

VERSION="$(npm version $1)"
git push && git push origin $VERSION
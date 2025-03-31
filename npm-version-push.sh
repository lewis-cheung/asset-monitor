# /bin/bash

VERSION="$(npm version $1)"
git push && git push origin $VERSION
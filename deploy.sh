#!/bin/sh
#deploy cam webpage

USER=mtf53
SERVER=gothics.cam.cornell.edu
SRC=/Users/homo/Code/public_html
TARGET=public_html
echo "Depoloying $TARGET to $SERVER..."
scp -r SRC $USER@$SERVER:$TARGET
echo "Deployment complete"
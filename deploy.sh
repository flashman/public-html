#!/bin/sh
#deploy cam webpage

DIR='/Users/homo/Code/'
USER='mtf53'
SERVER='gothics.cam.cornell.edu'
TARGET='/home/students/mtf53/public_html_new'
cd $DIR
echo "Depoloying $TARGET to $USER@$SERVER:$TARGET..."
scp -r public_html $USER@$SERVER:$TARGET
echo "Deployment complete"
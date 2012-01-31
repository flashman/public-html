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

ssh $USER@$SERVER
rm -r public_html_old
mv public_html public_html_old
mv public_html_new public_html
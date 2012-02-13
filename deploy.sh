#!/bin/sh
#deploy cam webpage

DIR='/Users/homo/Code/'
USER='mtf53'
SERVER='gothics.cam.cornell.edu'
TARGET='/home/students/mtf53/public_html_temp'
cd $DIR
echo "Creating temp directory"
rsync -arvuz public_html/ public_html_temp/ --exclude '.git' --exclude '.sh' --exclude 'README' --exclude 'com.apple.timemachine.supported' --exclude '.DS_Store'
echo "Depoloying $TARGET to $USER@$SERVER:$TARGET..."
scp -r public_html_temp $USER@$SERVER:$TARGET
echo "Deployment complete"
echo "Cleaning temp directory"
rm -r public_html_temp/

ssh $USER@$SERVER
#rm -r public_html_old
#mv public_html public_html_old
#mv public_html_temp public_html
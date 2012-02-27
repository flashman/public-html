#!/bin/sh
#deploy cam webpage

cd ..
echo "Depoloying public_html to mtf53@gothics.cam.cornell.edu:~/public_html ..."
rsync -arvuz public_html/ mtf53@gothics.cam.cornell.edu:~/public_html --exclude '.git' --exclude '.sh' --exclude 'README' --exclude 'com.apple.timemachine.supported' --exclude '.DS_Store'
echo "Deployment complete"
cd 'public_html'
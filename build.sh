make html
mkdir -p _doc 
rsync -aP _build/html/ _doc/
rsync -aP instructions _doc/
rsync -aP demo _doc/

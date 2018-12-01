make html
rm -rf _doc
mkdir -p _doc 
rsync -aP _build/doc/html/ _doc/
rsync -aP _build/instructions/html/ _doc/instructions/
rsync -aP demo _doc/

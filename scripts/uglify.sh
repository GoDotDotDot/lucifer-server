echo "pre clean..."
rm -rf dist
rm -rf result
echo "complie ts to js..."
yarn tsc --outDir dist
echo "uglify js..."
yarn uglifyjs-folder dist -ye -o result
echo "clear ts source code..."
find . -type f -iname \*.ts -delete
echo "move uglify js to project root..."
cp -r result/* .
echo "rename all uglify js to normal name(*.min.js to *.js)..."
for f in $(find . -iname "*.min.js*"); do mv $f $(dirname $f)/$(basename $f .min.js).js; done
echo "post clean..."
rm -rf dist
rm -rf result

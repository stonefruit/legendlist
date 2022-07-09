prev_version=$(cat VERSION.txt)
new_version=$(( prev_version + 1 ))

npm run build && npx gulp

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/__BUILD__/$RELEASE_VERSION/" build/index.html 
else
  sed -i -e "s/__BUILD__/$RELEASE_VERSION/" build/index.html 
fi

mkdir -p builds
cp build/index.html builds/legendlist.html && rm -rf build

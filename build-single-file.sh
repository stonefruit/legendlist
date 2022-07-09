prev_build=$(cat BUILD.txt)
new_build=$(( prev_build + 1 ))

npm run build && npx gulp

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/__BUILD__/Build $new_build on $(date +'%d %b %Y')/" build/index.html 
else
  sed -i -e "s/__BUILD__/Build $new_build on $(date +'%d %b %Y')/" build/index.html 
fi

# Checksum generation. Verify by running next 2 commands with 
# the sample file and compare first 3 letters
sha=($(shasum build/index.html ))
checksum_first_3=$(echo $sha |cut -c1-3)
filename="legendlist_build_"$new_build"_$checksum_first_3.html"

mkdir -p builds
cp build/index.html builds/$filename && rm -rf build

echo $new_build > BUILD.txt

echo "Copy and paste the path on a browser to view:"
echo $PWD/builds/$filename
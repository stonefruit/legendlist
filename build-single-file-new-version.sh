prev_version=$(cat VERSION.txt)
new_version=$(( prev_version + 1 ))

npm run build && npx gulp && 
sed -i '' -e "s/__BUILD__/v$new_version/" build/index.html 

# Checksum generation. Verify by running next 2 commands with 
# the sample file and compare first 3 letters
sha=($(shasum build/index.html ))
checksum_first_3=$(echo $sha |cut -c1-3)
filename="legendlist_v"$new_version".html"

mkdir -p builds
cp build/index.html builds/$filename && rm -rf build

echo $new_version > VERSION.txt

echo "Copy and paste the path on a browser to view:"
echo $PWD/builds/$filename
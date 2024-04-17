az login

yarn build . 

az storage blob upload-batch -s ./dist/ -d '$web' --account-name "caspecoroomsdev" --if-unmodified-since 2024-03-11T13:30Z --overwrite
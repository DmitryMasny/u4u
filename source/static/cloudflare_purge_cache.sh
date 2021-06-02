curl --request POST 'https://api.cloudflare.com/client/v4/zones/b95bb2ccae88deaebf710386cee31a7d/purge_cache' \
--header 'Authorization: Bearer GavLF5NjGdeS7F14GLK94Yu5T4GNXMCrIKE5rGPA' \
--header 'Content-Type: application/json' \
--data-raw '{"purge_everything":true}'

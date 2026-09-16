#!/bin/bash
set -e
BASE=http://localhost:8080/api/posts

# wait for server
for i in {1..30}; do
  if curl -s $BASE >/dev/null; then break; fi
  echo "Waiting for server... ($i)"; sleep 1
done

# create
CREATED=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title":"Smoke","content":"Smoke test","author":"CI"}' $BASE)
echo "Create: $CREATED"

# list
LIST=$(curl -s $BASE)
echo "List: $LIST"

ID=$(echo $CREATED | sed -E 's/.*"id":([0-9]+).*/\1/')
if [ -z "$ID" ]; then echo "No ID returned"; exit 1; fi

# get
GET=$(curl -s $BASE/$ID)
echo "Get: $GET"

# update
curl -s -X PUT -H "Content-Type: application/json" -d '{"title":"Smoke2","content":"Updated","author":"CI"}' $BASE/$ID

echo "Updated $ID"

# delete
curl -s -X DELETE $BASE/$ID

echo "Deleted $ID"

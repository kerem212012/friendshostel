curl -X 'GET' \
'http://localhost:1337/api/pages?sort=Sort%3Aasc&fields=Url%2CTitle%2CBody%2CIsMainMenu%2CSort&filters%5BIsMainMenu%5D=true' \
-H 'accept: application/json'
###Install TypeScript compile  
sudo apt install node-typescript   

###Install dependencies
npm i

###Install nodemon  
npm i nodemon -g  

###First terminal execute  
tsc -w  

###Second terminal execute:  
nodemon dist/main.js  

###MongoDB docker:  
https://hub.docker.com/_/mongo  
https://docs.mongodb.com/compass/master/?_ga=2.43088165.1675185868.1558187764-2016604619.1558187764  

docker run -d --network minha-rede --name mongodb \  
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \  
    -e MONGO_INITDB_ROOT_PASSWORD=secret \  
    -p 27017:27017 \  
    mongo:4.1  
    
docker stop mongodb  
docker start mongodb  
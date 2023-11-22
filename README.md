# A quick homework project for Intergrid


## Running the project
- install Kafka if needed, e.g (https://medium.com/@jaya.aiyappan/install-single-node-kafka-cluster-on-windows-and-test-it-65e24e07d0aa)
use grouId and clientId: 'my-app', and broker: 'localhost:9092'.
create folowing topics: 
"robot-commands",
"delivery-estimates",
"parcels"

- npm install dependencies, also install json-server, express, kafkajs and body-parser

- start in independed console in this order
- start kafka manually using two terminals: first run zookeeper-server-start.bat %KAFKA_HOME%/config/zookeeper.properties and when zookeeper is running, run kafka-server-start.bat %KAFKA_HOME%/config/server.properties in separate terminal
- start db by running npm run startDb in new terminal in project root
- start backend by running npm run startBack in new terminal in project root
- start frontend by running npm run startFront in new terminal in project root
- Enjoy! :)

### Assumptions and simplifications made:
-	each robot can have only one parcel
-	warehouse is a grid, each block is the same size
-	did not implement database updates, only state management. (parcel status is not updated etc.)
-	dashboard UI is left to minimal, as the scope was on backend
-	did not take the parcel priority into a count
-	did not implement charging logic
-	did not implement schemas or sanity checks for data
-	REST is inadequate as it wasn’t in the scope, the main function was only to provide data for backend
-	unit tests were left out as I ran out of time




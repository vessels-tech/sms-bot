

#Handy commands:

docker exec -it vesselssmsbot_mongo_1 bash
mongo
use sms-bot

>db.getCollection('readings').find()
>db.getCollection('Service').find({"serviceId":1})
>show collections

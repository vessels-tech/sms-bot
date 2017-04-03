# sms-bot
A sms bot for data collection. Backed by Amazon Lex.


## Proposal

The basic idea of this project is an SMS data collection bot.
We are going to play around with using Amazon Lex build most of the logic in the box, but may move away, because who wants to leave all of the fun stuff to Amazon?

By building it with Lex, we can hopefully get a good feel for how it will work, and also define an interface for interacting with our chatbot's functions, which we can then implement ourselves if we so desire.

An important thing to note is that our final destination language is not English, it will be Hindi, Gujarati & Rajasthani. But let's start with english for now, and then we might teach it a bit of pirate.


##MVP
As described in this here post: https://medium.com/vessels/building-a-nlp-system-for-mywell-part-1-3fdc9d41e312

Basically, we want a strict query such as:
``` code:bash
              SMA 000 313603 151125 1501 1500
>Thanks! Well reading recorded for wellId 1501
```       

to become more like:
``` code:bash
        Well 1501 has a latest reading of 12.2m
>on what day did you take this reading
>and what postcode are you in?
                               313603, on today.
>Thanks! Well reading recorded for wellId 1501
```

##Definitions

query:
  - The request that is made when the sms-bot has obtained all required information over SMS.


conversation:
  - the communication between a mobile phone and the sms-bot, consisting of but not limited to one request and one response.
    A conversation may have multiple requests and responses if the sms-bot determines that it does not have enough information to complete a query



##System Design

Our system will follow the rough outline below:

    +----------+
    |          |      +---------------------------------+
    |  s3: log |      |                                 |
    |          <------+          Amazon Lex Api         |
    +----------+      |                                 |
                      |                                 |
                      +--^-----^---------------+----+---+
                         |     |               |    |
                         |     |               |    |
+--------------+      +--+-----+-----+     +---v----v---+
|   Redis:     +------>              |     |            |
|   Context    |      |   Lambda:    |     |   Lambda:  |
|   Cache      <------+   Query      |     |   Response |
+--------------+      |              |     |            |
                      +------^-------+     +-----+------+
                             |                   |
                      +------+-------------------v------+
                      |                                 |
                      |      Vessels-SMS-Middleware?    |
                      |                                 |
                      +------^--------------------+-----+
                             |                    |
                             |                    |
                      +------+--------------------v-----+
                      |                                 |
                      |            SMS Gateway          |
                      |                                 |
                      +---^-+-----^-+-----^-+-----^-+---+
                          | |     | |     | |     | |
                         ++-v+   ++-v+   ++-v+   ++-v+
                         |   |   |   |   |   |   |   |
            Cell Phones  |   |   |   |   |   |   |   |
                         |   |   |   |   |   |   |   |
                         |   |   |   |   |   |   |   |
                         +---+   +---+   +---+   +---+


- SMS Gateway:
  A service that will provide us with a virtual number, receive SMS messages and forward them as HTTP calls, and turn HTTP calls into SMS messages. We already have one for MyWell, so that will be enough to get us started.

- Vessels-SMS-Middleware:
  I'm not sure if we need this. Perhaps we can handle all of the necessary query configuration and success/ failure handling inside of each lambda function, so the middleware might just be a part of the query and response handlers.

  I'm putting it here to remind me of the future requirements. We need a way to dynamically change what type of query we are making, and what to do once we have successfully completed a query. For the MVP, this could just communicate to the MyWell service with a HTTP call once a query is complete.

- Lambda, Query and Response:
  These lambda functions will likely end up doing most of the work for now, communicating between the SMS Gateway (or middleware) and Amazon Lex (or our own NLP engine we end up writing in the future.)

  I've decided to separate out query and response for a number of reasons:
  1. It is likely that a 'conversation' will have lengthy gaps between responses over SMS, thus it makes no sense for a single lambda function to be waiting around (lambdas have a maximum timeout of 5 minutes)

  2. The request to Lex, and response from Lex are quite different, and it makes sense (at least I think so) to separate them out into 'single purpose' functions. This is a good practice for FaaS anyways.

- Redis: Context Cache
  About halfway through designing this I figured we would need some state somewhere. I don't want to go for a database, as we only need to keep data around for the length of a conversation, at which point we hand off our data to another service. Redis is a good match for this. I also don't want to have to pay for a database.

  It's easy to imagine how we can put a cell phone number as a key, and whatever last conversation with that number gives us the ability to build in context into a conversation. That said, Lex likely has some similar features, so we may not even need a redis cache.

- Amazon Lex Api:
  AWS's api for NLP, among other things. I don't know too much about it yet.

- s3 log:
  We need a way to analyse conversations and queries that have already taken place, in order to improve the system. Logging to s3 will suffice for now, as we build the MVP.

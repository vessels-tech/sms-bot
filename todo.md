#TODO's


##Roadmap:
- build basic management console
- Integrate with MyWell & Way2Mint
- Add more queries for MyWell, using console
- Find some actual customers and on-board them
  - What is the mvp for new customers?
- Add more integrations


##Capture todos here
- load Thread required entities from DB
- load Intent types from DB
- load wit config from DB

- fix Thread.handleResponseReceived
  - add post response steps

- For some reason, Thread is asking the router if the conversation is complete,
  - I think the router should really be doing this...
  - Change this to the router checking

- Set 5 minute expiry on redis conversations
- Add "cancel" or "stop" ability to conversation

- End to end integration test script
  - Make so we can target either local or running deployment

- Load actual config from database
- Integrate with Cognito for user login/management
- Add SEED_FROM_S3 and BACKUP_TO_S3 steps to sms-utils


- Fix bootstrap, don't use CDN
- Set mongo client settings from env variables
- Maybe get material UI going with the UI page - seems pretty easy http://www.material-ui.com/#/customization/colors



##API interactions:

                                                                     +---------------------------+
                                                                     |                           |
                                                                     |                           |
                                                                     |       WitAi API           |
                                                                     |                           |
                                                                     |                           |
                                                                     +-------------^-------------+
                                                                                   |
                                                                                   |
                                                              +--------------------v--------------------+
                                                              | Conversation Delegate                   |
                                                              |                                         |
                                                              |                                         |
                                                              |                                         |
                                                              |                                         |
                                                              | +-------------------------------------+ |
                             +-------------------------+      | |                                     | |     +------------------------+
                             |                         |      | |                                     | |     |                        |
           Nexmo  <---------->                         |      | |          Thread                     | |     |                        <------->  MyWell
                             |                         |      | |                                     | |     |                        |
           Way2Mint<--------->      Message Router     <------> |                                     | <----->      Services API      <------->  Ushahadi
                             |                         |      | +-------------------------------------+ |     |                        |
           Test    <--------->                         |      | +-------------------------------------+ |     |                        <------->  mock-service
                             |                         |      | |                                     | |     |                        |
                             +-------------------------+      | |                                     | |     +------------------------+
                                                              | |          Thread                     | |
                                                              | |                                     | |
                                                              | |                                     | |
                                                              | +-------------------------------------+ |
                                                              | +-------------------------------------+ |
                                                              | |                                     | |
                                                              | |                                     | |
                                                              | |          Thread                     | |
                                                              | |                                     | |
                                                              | |                                     | |
                                                              | +-------------------------------------+ |
                                                              |                                         |
                                                              +-----------------------------------------+

#TODO's


Overall roadmap:
- build Facebook demo bot:
  https://developers.facebook.com/docs/messenger-platform/guides/quick-start
- build management console
- Integrate with MyWell & Way2Mint
- Deploy!
- Add more queries for MyWell, using console
- Find some actual customers and on-board them
  - What is the mvp for new customers?
- Add more integrations


##Capture todos here

- make a script for combining the docker-compose.prod.yml files with docker-compose to generate docker-cloud.yml

- fix Thread.handleResponseReceived
  - post response steps
  - make it handle replies from service etc.

- For some reason, Thread is asking the router if the conversation is complete,
  - I think the router should really be doing this...
  - Change this to the router checking

- Start building website for demoing chatbot

- Start building manangement console, for adding new queries, etc.

- migrate to docker swarm?






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

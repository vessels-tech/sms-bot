#TODO's

##Capture todos here

- fix Thread.handleResponseReceived
  - post response steps
  - make it handle replies from service etc.

- For some reason, Thread is asking the router if the conversation is complete,
  - I think the router should really be doing this...
  - Change this to the router checking

- Start building website for demoing chatbot

- build interface to interact with SMS Services (that can be extended beyond just SMS)
  - Nexmo
  - Twilio
  - Way2Mint
- Fix the way we handle responses from MyWell - right now we just assume that everything is ok, but this doesn't work for handling queries instead of simply submissions.

- replace isNullOrUndefined

- write deploy tools with cloudformation, ECS, etc...
- Continuous Integration...






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
           Way2Mint<--------->      Message API        <------> |                                     | <----->      Services API      <------->  Ushahadi
                             |                         |      | +-------------------------------------+ |     |                        |
           Test    <--------->                         |      | +-------------------------------------+ |     |                        <------->  etc...
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

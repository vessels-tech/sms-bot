# sms-bot
A sms bot for data collection. Backed by Amazon Lex.


##Proposal

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

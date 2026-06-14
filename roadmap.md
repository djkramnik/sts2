## Putzing Around

## todo
stage: UI for testing/enjouyment

1. in the UI.. consume the sim stream.  But buffer the data coming in, and then play each individual turn one card move at a time.  May need to tighten up the output of the stream first, preferably using formalized schemas (zod)

1. we have formalized the stream... maybe more work needed on that later but for now.. save stream events to react state array.  then render 0-{index} of the stream.  UI element to increment the index..


## roadmap
1. UI for testing / enjoyment
2. Model the game more thoroughly / accurately.
  * effects / multiple enemies / potions / relics / card upgrades
4. Build out the cards for a class / set of enemies.  back this against a DB
3. Alphago this


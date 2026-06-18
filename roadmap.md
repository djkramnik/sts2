## Immediate todo
* card(s) that effect dex and str
* show dex and str in cards in UI
* player status message with dex and str
* show player dex and str in UI

## Putzing Around

* lengthy features list

* stat modifiers (str / dex)
* stat modifiers that get removed at turn end
* buffs / debuffs (vuln, weak, frail)
* vig is special buff?
* draw modifiers
* cards that do things at start or end of turn independent of their invocation
* card upgrades
* exhaust
* cards that target other cards
* card creation
* X cards

* powers
* potions
* relics

* multiple enemies

* proper card import backed by DB
*

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


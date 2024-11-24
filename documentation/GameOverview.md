# What is Fork-off?

- Fork-Off is a collaborative, text-based storytelling game designed for group fun, focusing on humor and creative storytelling.
- Players work together to create a branching narrative by voting on different story paths, leading to unexpected twists, hilarious outcomes, and a unique story experience.

# How to Play Fork-Off:

### Room Creation:

- One player creates a room
- They can invite people to join
- They set the number of forks they want their story to have
- They configure the amount of variance introduced in each round of forking
  - Variance goes from 1 - 10
  - Example of how two forks given the starting sentence "Jamie climbed to the top of a tree."
    - Variance 1:
      - "At the tree-top, Jamie found an apple and bit into it"
      - "At the tree-top, Jamie found a pear and threw it as far as he could"
    - Variance 10:
      - "At the tree-top, Jamie found an apple and bit into it"
      - "At the tree-top, Jamie turned into a bird and went looking for a mate"
- Once all players have joined, the user who created the round can start the game.

### The First Round:

- Once the game starts, each player has 1 minute to enter a phrase that they want to influence the beginning of the story
- Once the time runs out or all answers are submitted, Fork-off uses the responses to generate an origin sentence and the number of forks specified at the start of the game

### Following Rounds:

- Player Turn
  1. Read through each fork
  2. Vote on which forks they want to make it through to the next round
     2a. Players get 3 votes
     2b. Players can vote for the same fork multiple times
  3. Submit a phrase they want to influence the next round
  4. The round concludes either when all responses are submitted or when 5 minutes (time-limit) has expired
- Fork-off's Response
  - Once the player round expires, Fork-off takes the top forks from that round and generates a next step for them based on the combined suggestions of the players.
  - If the players vote for a smaller number of forks than the number set at the start of the game, then fork-off will generate an equal number of multiple forks per persisted story head, even if it causes a round with a greater number of forks than set at the start of the game.
  - If multiple forks tie and it results in a scenario where more than one could be eliminated (ex: 4 forks tie and only 3 are normally persisted), then both tying forks are persisted to the following round. The game will prune back to the normal maximum the proceeding round if possible

### End of the Game:

- The story ends whenever the majority of players vote to have it end or at some maximum step count.

### More Details:

- Adjusting the room configuration
  - At any point during gameplay, the person who created the room can adjust the number of forks they want generated as well as the variance between rounds
- Story Coherence:
  - Players can see a summary of each fork at all times
  - Players can read the entirety of a story if they want
- Sharing after game-play
  - I think users should be able to export the entire story after playing as some sort of JSON or something
  - I imagine we want some page that allows people to upload JSON and see the whole story tree

# What is Fork-off?

- Fork-Off is a collaborative, text-based storytelling game designed for group fun, focusing on humor and creative storytelling.
- Players work together to create a branching narrative by voting on different story paths, leading to unexpected twists, hilarious outcomes, and a unique story experience.

# How to Play Fork-Off:

### Room Creation:

- One player creates a room
- They can invite people to join (by sharing the code)
- They set the number of rounds
- They can set the style of the story and any other base prompts for the storytelling engine
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

- Once the game starts, each player has:
  - 1 minute to enter a phrase that they want to influence the beginning of the story
  - 1 minute to enter a phrase that the want to influence the first fork
  - 1 minute to enter a phrase that they want to influnce (another) first fork
- Once the time runs out or all answers are submitted, Fork-off uses the responses to generate an origin sentence and one fork per player (by combining two prompts)

### Following Rounds:

1. Players are assigned two forks from the previous round to create prompts for
   1a. Players get one minute per prompt
2. 2n forks are generated
3. Players vote on which forks they want to make it through to the next round
   3a. Players get 1 vote per player in the game
   3b. Players cannot vote for the same fork multiple times
   3c. In case of a tie, we randomly include a fork if needed or trim one randomly depending on the situation
4. The round concludes either when all responses are submitted or when the time limit has expired (30s per fork?)
5. Points are awarded based on who contributed to the forks that are getting progressed

### End of the Game:

- The story ends whenever the majority of players vote to have it end or at some maximum step count.

### More Details:

- Adjusting the room configuration
  - At any point during gameplay, the person who created the room can adjust how many rounds they want gameplay to last, as well as the variance between rounds, and the default prompt to the storyteller
- Story Coherence:
  - Players can see a summary of each fork at all times
  - Players can read the entirety of a story if they want
- Sharing after game-play

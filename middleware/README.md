# Game Server middleware

## Getting started
First make sure to [install Supabase](https://supabase.com/docs/guides/getting-started/local-development#prerequisites)

See the Supabase documentation for more info about Supabase [CLI commands](https://supabase.com/docs/reference/cli/supabase-init).

### Run Supabase locally

```npm
cd ./middleware

# Spin up Supabase
supabase start

# Stop Supabase
supabase stop
```

### Deploy to Supabase
For this tutorial we are going to push our migrations directly to Supabase. For production environments we recommend setting up a CI pipeline like described [here](https://supabase.com/docs/guides/cli/managing-environments#deploy-a-migration).

First create an account at [Supabase](https://supabase.com/) and setup a project. Next login in with the CLI and link your project.

```npm
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref $PROJECT_ID

# Push db migrations to Supabase
supabase db push
```

## Functions

### Scheduling
- A cron-based Supabase edge function will query the `game` table each 5 minutes for scheduled games starting within the next hour. 
- It will create an `active_game` record 1 hour before the start of the game.

### Updating game state questions
A cron-based Supabase edge function will run every X seconds and will update the `active_game` + `game_question` tables before each round:

- The `active_game` fields `right_count`, `wrong_count` + `answer` will be reset and `round` will be updated with +1.
- A question will randomly be picked from the `question` table, excluding questions already in the `game_question` table for current game. `question` within `active_game` will be updated with the selected question.
- A record will be inserted into `game_question` for the new question.

### Updating game state answers
A cron-based Supabase edge function will run every X seconds and will update the `active_game` + `game_question` tables after each round:

- After each question the `answer` + `players_remaining` will be updated.
- When a winner has been decided `winner` + `price` will be updated for `active_game`.

### Answering
- Submitting answers will be done through an api endpoint (edge function). 
  - It will check:
    - Whether the player is still in the game by checking the `player_game` table for the `round` and `eliminated` fields.
    - If the user hasn't already answered the question by checking the `answers` field in `player_game`.
  - If the player is still in the game and hasn't answered the question:
    - The answer will be added to `answers` in `player_game`.
    - If answer is correct the `round` in `player_game` will be updated to the next.
    - If the answer is wrong `eliminated` will be set to true
  - After submitting an answer the right + wrong counts of the `active_game` will be updated.


## Client
The client will query `active_game` for any games starting soon.
 - If 1 game has been found the app will start watching for changes of the `active_game` table.
 - If multiple games have been found the player can select a game from the list (later).
 - A player can participate by connecting their wallet.

## Database

### game
- Contains all scheduled + completed games. Serves as a history of played games. 
- Participant count will be added once the game has been completed.

### active_game

- App will watch game state to update the interface
- Used questions ids will be added to the game to prevent double questions from being picked

### player_game
- State for app to watch for changes
- History for games player has played

### game_question
- History of questions asked for games and their right / wrong counts.

## GraphQL
Supabase automatically generates a GraphQL API. For this app it's restricted to queries only. Mutations have been disabled by revoking access for the postgres user `anon` and only granting select + trigger access. See the example below and the migrations .sql files.

```postgresql
-- Restrict API access to query only
revoke all on table game from anon;
grant references, select, trigger on table game to anon;
```

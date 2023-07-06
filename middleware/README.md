# Backend with SupaBase

## Introduction

For this demonstration we will use Supabase for storing centralized data and excuting edge functions. Although any modern backend system should suffice.

[Supabase](https://supabase.com) is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration. If you don't have an account you can sign up for a free account at the link above.

## Getting started

First make sure to [install Supabase](https://supabase.com/docs/guides/getting-started/local-development#prerequisites)

See the Supabase documentation for more info about Supabase [CLI commands](https://supabase.com/docs/reference/cli/supabase-init).

### Run Supabase locally

**Note:** To test the cronjobs locally you have to update YOUR_NGROK_ID + YOUR_SUPABASE_ANON_KEY inside the cronjob migrations files (see cronjobs section) before starting supabase.
**Note:** Ngrok will time out after 2 hours with the free version.

```npm
cd ./middleware

# Spin up Supabase
supabase start

# Stop Supabase
supabase stop
```

## What we will create

- Database migrations will be used to setup our Postgres database / Supabase.
- We will use the [Supabase isomorphic JS SDK](https://supabase.com/docs/reference/javascript/introduction) to queries + perform actions on our database in both our backend (edge functions) + frontend. Supabase can also auto REST + GraphQL API's automatically but for this app we will not use them.
- Our application logic will be implemented by using Supabase edge functions.
- A postgres function will be used to randomly pick questions from our questions table.
- Postgres cronjobs will be used to call edge functions to:
  - create active games for soon to start (within 1 hour) games.
  - make the game real-time by updating the active game state before + after each question.

### Client

- The client will use [Supabase real-time](https://supabase.com/docs/guides/realtime) websockets and listen to [Postgres changes](https://supabase.com/docs/guides/realtime/postgres-changes).
- The client will query the `active_game` table for any games starting soon.
  - If 1 game has been found the client will start watching for changes of the `active_game` table for that game.
  - If multiple games have been found the player could select a game from the list (optional, not implemented in this challenge).
  - A player can participate by connecting their wallet. 
- The client will watch for changes of the `player_game` table to check whether current user is still in the game.

## Database

- `./middleware/supabase/migrations` directory creates the SQL scripts to setup our Postgres database.
- `./middleware/supabase/seed.sql` will be used by Supabase to seed the database when starting Supabase locally. It contains test data with some games + players to make it easier to develop + test locally.

```npm
# Create a new migration
supabase migration new pick_random_question
```

### player table
- Contains players with their Koinos address as player_id and win + game counts.

### game table
- Contains all scheduled + completed games with their rewards. Will be used to create active_games.
- Also serves as a history of played games.
- Winner + participant count will be added once the game has been completed.

### question table
- Contains our pool of questions to pick from with their answers.

### active_game table
- Contains real-time data (current question, answer, players remaining / wrong/ right counts) for active games + games starting within 1 hour.
- The client will watch game state (using Supabase realtime Postgres changes) to update the interface.

### player_game table
- Contains real-time data for client to provide feedback to current user of the game he/she is participating in.
- Also serves as a history of games the player has played.

### game_question table
- History of questions asked for games and their right / wrong counts.
- Postgres function pick_random_question will use this table to prevent picking double questions.


## Supabase edge functions
 
- [Developing functions locally](https://supabase.com/docs/guides/functions/local-development)
- [Functions + env files](https://supabase.com/docs/guides/functions/secrets)

Please note: Supabase functions work with [Deno](https://deno.com/manual@v1.34.1/getting_started/installation) instead of Node runtime.

### Schedule games

- A cron-based function will query the `game` table each 15 minutes for scheduled games starting within the next hour.
- It will create an `active_game` record 1 hour before the start of the game.

### Join game

- User can join a soon to start game from the `active_game` table that hasn't started yet.
- A new record inside `player_game` will be created.
- Participant_count + players_remaining will be updated for the `active_game`.

### Pick next questions

A cron-based function will run each every 30 seconds and will update the `active_game` + `game_question` tables before each round:

- The `active_game` fields `right_count`, `wrong_count` + `answer` will be reset and `round` will be updated with +1.
- A question will randomly be picked from the `question` table using the Postgres function `pick_random_question`, excluding questions already in the `game_question` table for current game. `question` within `active_game` will be updated with the selected question.
- A record will be inserted into `game_question` for the new question.

### Process results

A cron-based function will run every 30 seconds (20 seconds after the pick-next-question cronjob) and will update the `active_game` + `game_question` tables after each round:

- After each question the `answer` + `players_remaining` will be updated.
- When a winner has been decided `winner` + `price` will be updated for `active_game` + `game`.

### Submit answer

- Submitting answers will be done by calling this function with the Supabase SDK.
  - This function will check:
    - Whether the player is still in the game by checking the `player_game` table for the `round` and `eliminated` fields.
    - If the user hasn't already answered the question by checking the `answers` field in `player_game`.
  - If the player is still in the game and hasn't answered the question:
    - The answer will be added to `answers` in `player_game`.
    - If answer is correct the `round` in `player_game` will be updated to the next round.
    - If the answer is wrong or the player has timed-out `eliminated` will be set to true.
  - After submitting an answer the right + wrong counts of the `active_game` will be updated.

### Commands
```npm
# Create a new function
supabase functions new my-function

# Run functions locally with env file + debug
supabase functions serve --env-file ./supabase/.env.local --debug

# Deploy a single function to Supabase
supabase functions deploy process-results

# Deploy all our created functions at once to Supabase with npm script
npm run deploy:functions

# Invoke a function:
curl -i --location --request POST 'http://localhost:54321/functions/v1/join-game' \
--header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
--header 'Content-Type: application/json' \
--data '{"name":"Hello"}'

#
# Secrets management
#

# For Production copy env file
cp ./supabase/.env.local ./supabase/.env

# Deploy secrets to Supabase
supabase secrets set --env-file ./supabase/.env

# View all secrets
supabase secrets list 

#Set secrets for your project
supabase secrets set NAME1=VALUE1 NAME2=VALUE2 

# Unset secrets for your project
supabase secrets unset NAME1 NAME2
```

## Cronjobs
Make sure to the Supabase database extensions `pg_cron` + `pg_net` are activated (should be activated by the setup migration).

Watch the following video to learn more about cronjob with postgres + Supabase.
[Scheduling functions with Supabase](https://supabase.com/docs/guides/functions/schedule-functions)

We are going to use migrations to setup our cronjobs instead of the Supabase dashboard (like in the guide). 
You can still use the dashboard to view configured cronjobs + executions like in the video from the guide.

### Testing cronjobs locally
To test the cronjobs with your local Supabase instance you will have to use [ngrok](https://ngrok.com) because localhost cannot be called by Postgres functions.

### Delayed cronjobs
To make the timing work for loading questions + processing results we will create two cronjobs with a delay for the second ones.
This is required because cronjobs can only be scheduled in minute intervals.

### Migration files
To make the cronjobs work edit the 3 cronjob migration files:
- When working with your local Supabase instance: replace YOUR_NGROK_ID with your ngrok url and restart Supabase.
- When working with your hosted Supabase instance: replace YOUR_SUPABASE_PROJECT_ID with your project id
- Replace YOUR_SUPABASE_ANON_KEY with your Supabase anon

```postgresql
CREATE OR REPLACE FUNCTION call_pick_next_questions(delay integer)
  RETURNS bool AS $call_pick_next_questions$
BEGIN
  PERFORM
    net.http_post(
            url:='https://YOUR_NGROK_ID.ngrok.com/functions/v1/pick-next-questions',
            -- url:='https://YOUR_SUPABASE_PROJECT_ID.functions.supabase.co/pick-next-questions'
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb
      ),
    pg_sleep(delay);

  RETURN true;
END;
$call_pick_next_questions$ LANGUAGE plpgsql;

SELECT cron.schedule('call_pick_next_questions0', '* * * * *', 'SELECT call_pick_next_questions(0)');
SELECT cron.schedule('call_pick_next_questions30', '* * * * *', 'SELECT call_pick_next_questions(30)');
```

## Deploying to Supabase
For this tutorial we are going to push our migrations directly to Supabase. For production environments we recommend setting up a CI pipeline like described [here](https://supabase.com/docs/guides/cli/managing-environments#deploy-a-migration).

First create an account at [Supabase](https://supabase.com/) and setup a project. Next login in with the CLI and link your project.

```npm
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_SUPABASE_PROJECT_ID

# Push db migrations to Supabase
supabase db push
```

## Remarks

### Vue-test app
Included is a simple vue app that was used to test our Supabase setup and simulate games.

### Generate Types
```npm
mkdir schema

# Generate types from your local Supabase
supabase gen types typescript --local --schema public > schema/database.types.ts

# Generate types from your hosted Supabase
supabase gen types typescript --linked --schema public > ./schema/schema.ts
```

### Caveats
- Supabase has [rate limits](https://supabase.com/docs/guides/realtime/rate-limits) for concurrent connections. You might want to add limit the amount of players for games based on your Supabase plan.

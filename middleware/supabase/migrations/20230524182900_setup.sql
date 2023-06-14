-- Enable the cron + pg_net extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Convert snake_case (postgres) names to camelCase (GraphQL)
comment on schema public is '@graphql({"inflect_names": true})';

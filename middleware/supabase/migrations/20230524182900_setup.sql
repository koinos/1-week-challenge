-- Convert snake_case (postgres) names to camelCase (GraphQL)
comment on schema public is '@graphql({"inflect_names": true})';

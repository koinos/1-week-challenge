--
-- Game
--

create table if not exists game
(
    id                uuid             DEFAULT gen_random_uuid() not null
        constraint game_pkey
            primary key,
    start_at          bigint  not null,
    active            boolean not null default false,
    price             varchar not null,
    winner_id         uuid,
    constraint game_winner_fkey
        foreign key (winner_id)
            references player (id),
    participant_count smallint
);

comment on constraint game_winner_fkey
    on game
    is E'@graphql({"foreign_name": "winner", "local_name": "wonGames"})';

-- Restrict API access to query only
-- revoke all on table game from anon;
-- grant references, select, trigger on table game to anon;

--
-- Active Game
--

create table if not exists active_game
(
    id                uuid              DEFAULT gen_random_uuid() not null
        constraint active_game_pkey
            primary key
        constraint active_game_game_fkey
            references game (id),
    starts_at         bigint   not null,
    round             smallint,
    round_ends        bigint,
    question          varchar,
    answer            varchar,
    players_remaining smallint,
    right_count       smallint not null default 0,
    wrong_count       smallint not null default 0,
    price             varchar,
    winner            uuid
);

-- Restrict API access to query only
revoke all on table active_game from anon;
grant references, select, trigger on table active_game to anon;

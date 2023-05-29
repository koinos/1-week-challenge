--
-- Player Game
--

create table if not exists player_game
(
    id         uuid              DEFAULT gen_random_uuid() not null
        constraint player_game_pkey
            primary key,
    player_id  varchar  not null,
    constraint player_game_player_fkey
        foreign key (player_id)
            references player (id),
    game_id    uuid     not null,
    constraint player_game_game_fkey
        foreign key (game_id)
            references game (id),
    round      smallint not null default 0,
    eliminated boolean  not null default false,
    answers    jsonb    not null default '[]',
    price      varchar
);

-- Restrict API access to query only
-- revoke all on table player_game from anon;
-- grant references, select, trigger on table player_game to anon;

--
-- Active Game
--

create table if not exists active_game
(
    id                   uuid              DEFAULT gen_random_uuid() not null
        constraint active_game_pkey
            primary key
        constraint active_game_game_fkey
            references game (id),
    start_at             bigint   not null,
    round                smallint not null default 0,
    round_ends           bigint   not null,
    question             varchar,
    question_id          varchar,
    answer               boolean,
    real_fact_if_fiction varchar,
    participant_count    smallint not null default 0,
    players_remaining    smallint not null default 0,
    right_count          smallint not null default 0,
    wrong_count          smallint not null default 0,
    rewards              varchar,
    winner               varchar,
    ended                boolean  not null default false
);

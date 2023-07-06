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
    rewards           varchar not null,
    winner            varchar,
    constraint game_winner_fkey
        foreign key (winner)
            references player (id),
    participant_count smallint
);

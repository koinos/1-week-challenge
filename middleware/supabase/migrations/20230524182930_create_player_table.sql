--
-- Player
--

create table if not exists player
(
    id         varchar  not null
        constraint player_pkey
            primary key,
    win_count  smallint not null default 0,
    game_count smallint not null default 0,
    created_at TIMESTAMPTZ       DEFAULT Now()
);

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

-- Restrict API access to query only
-- revoke all on table player from anon;
-- grant references, select, trigger on table player to anon;

--
-- Player
--

create table if not exists player
(
    id         uuid        DEFAULT gen_random_uuid() not null
        constraint player_pkey
            primary key,
    win_count  smallint                              not null,
    game_count smallint                              not null,
    created_at TIMESTAMPTZ DEFAULT Now()
);

-- Restrict API access to query only
-- revoke all on table player from anon;
-- grant references, select, trigger on table player to anon;

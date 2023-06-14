--
-- Game Question
--

create table if not exists game_question
(
    id            uuid              DEFAULT gen_random_uuid() not null
        constraint game_question_pkey
            primary key,
    game_id       uuid     not null,
    constraint game_question_game_fkey
        foreign key (game_id)
            references game (id),
    question_id   uuid     not null,
    constraint game_question_question_fkey
        foreign key (question_id)
            references question (id),
    round         smallint not null,
    started_count smallint not null,
    right_count   smallint not null default 0,
    wrong_count   smallint not null default 0
);

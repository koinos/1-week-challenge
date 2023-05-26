--
-- Game
--

create table if not exists question
(
    id                   uuid DEFAULT gen_random_uuid() not null
        constraint question_pkey
            primary key,
    question             varchar                        not null,
    is_fact              boolean                        not null,
    real_fact_if_fiction varchar
);

-- Restrict API access to none
revoke all on table question from anon;
grant references, trigger on table question to anon;

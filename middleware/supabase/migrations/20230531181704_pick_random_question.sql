create or replace function pick_random_question(game_id uuid)
    returns question
    language sql
as $$
select * from question
where question."id" not in (select game_question."question_id" from game_question where game_question."game_id" = pick_random_question.game_id)
order by random()
limit 1;
$$;

CREATE OR REPLACE FUNCTION call_pick_next_questions(delay integer)
    RETURNS bool AS $call_pick_next_questions$
BEGIN
    PERFORM
        net.http_post(
                url:='https://YOUR_NGROK_ID.ngrok.io/functions/v1/pick-next-questions',
                -- url:='https://YOUR_SUPABASE_PROJECT_ID.functions.supabase.co/pick-next-questions',
                headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb
            ),
        pg_sleep(delay);

    RETURN true;
END;
$call_pick_next_questions$ LANGUAGE plpgsql;

SELECT cron.schedule('call_pick_next_questions0', '* * * * *', 'SELECT call_pick_next_questions(0)');
SELECT cron.schedule('call_pick_next_questions20', '* * * * *', 'SELECT call_pick_next_questions(20)');
SELECT cron.schedule('call_pick_next_questions40', '* * * * *', 'SELECT call_pick_next_questions(40)');

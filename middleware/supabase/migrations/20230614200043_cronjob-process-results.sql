CREATE OR REPLACE FUNCTION call_process_results(delay integer)
    RETURNS bool AS $call_process_results$
BEGIN
    PERFORM
        net.http_post(
                url:='https://YOUR_NGROK_ID.ngrok.io/functions/v1/process-results',
                -- url:='https://YOUR_SUPABASE_PROJECT_ID.functions.supabase.co/process-results',
                headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb
            ),
        pg_sleep(delay);

    RETURN true;
END;
$call_process_results$ LANGUAGE plpgsql;

SELECT cron.schedule('call_process_results15', '* * * * *', 'SELECT call_process_results(15)');
SELECT cron.schedule('call_process_results35', '* * * * *', 'SELECT call_process_results(35)');
SELECT cron.schedule('call_process_results55', '* * * * *', 'SELECT call_process_results(55)');

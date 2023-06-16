CREATE OR REPLACE FUNCTION call_cleanup_active_games()
    RETURNS bool AS $call_cleanup_active_games$
BEGIN
    PERFORM
        net.http_post(
                url:='https://YOUR_NGROK_ID.ngrok.io/functions/v1/cleanup-active-games',
            -- url:='https://YOUR_SUPABASE_PROJECT_ID.functions.supabase.co/cleanup-active-games',
                headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb
            );

    RETURN true;
END;
$call_cleanup_active_games$ LANGUAGE plpgsql;

SELECT cron.schedule('call_cleanup_active_games', '0,15,30,45 * * * *', 'SELECT call_cleanup_active_games()');

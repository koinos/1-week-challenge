CREATE OR REPLACE FUNCTION call_submit_game_stats()
    RETURNS trigger AS $call_submit_game_stats$
BEGIN
    PERFORM
        net.http_post(
                url:='https://YOUR_NGROK_ID.ngrok.io/functions/v1/submit-game-stats',
            -- url:='https://YOUR_SUPABASE_PROJECT_ID.functions.supabase.co/submit-game-stats',
                headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"}'::jsonb,
                body:=format('{"gameId": "%s"}', NEW.id)::jsonb
            );

    RETURN NEW;
END;
$call_submit_game_stats$ LANGUAGE plpgsql;

CREATE TRIGGER submit_game_stats_on_active_game_ended
    AFTER update on "public"."active_game"
    FOR EACH ROW
    WHEN (NEW.ended = true AND OLD.ended = false AND NEW.winner IS NOT NULL)
    EXECUTE FUNCTION call_submit_game_stats()

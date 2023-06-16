import { useEffect, useRef, useState } from "react";
import {
  createClient,
  RealtimeChannel,
  REALTIME_LISTEN_TYPES,
} from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function joinGame(playerId: string, gameId: string) {
  return await supabaseClient.functions.invoke("join-game", {
    method: "POST",
    body: {
      playerId,
      gameId,
    },
  });
}

export async function submitAnswer(
  playerId: string,
  gameId: string,
  answer: boolean
) {
  return await supabaseClient.functions.invoke("submit-answer", {
    method: "POST",
    body: {
      playerId,
      gameId,
      answer,
    },
  });
}

export function useActiveGames(gameId?: string) {
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any[]>();
  const channel = useRef<RealtimeChannel>();

  useEffect(
    () => () => {
      channel.current?.unsubscribe();
    },
    []
  );

  useEffect(() => {
    async function initialFetch() {
      setFetching(true);
      let fetcher = supabaseClient.from("active_game").select();

      if (gameId) {
        fetcher = fetcher.eq("id", gameId);
      }

      const result = await fetcher;
      if (result.error) {
        console.error(result.error);
        setError(result.error.message);
      } else {
        setData(result.data);
      }
      setFetching(false);
    }
    initialFetch();
  }, [gameId]);

  channel.current = supabaseClient
    .channel("schema-db-changes")
    .on(
      `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
      {
        event: "*",
        schema: "public",
        table: "active_game",
        filter: gameId ? `id=eq.${gameId}` : undefined,
      },
      (payload) => {
        console.log(payload);
        // setData(payload);
      }
    )
    .subscribe();

  return { fetching, error, data };
}

export function usePlayerGames(gameId?: string) {
  supabaseClient
    .channel("schema-db-changes")
    .on(
      `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
      {
        event: "*",
        schema: "public",
        table: "player_game",
        filter: gameId ? `game_id=eq.${gameId}` : undefined,
      },
      (payload) => {
        console.log(payload);
      }
    )
    .subscribe();
}

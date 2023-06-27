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
): Promise<boolean> {
  const result = await supabaseClient.functions.invoke<{ right: boolean }>(
    "submit-answer",
    {
      method: "POST",
      body: {
        playerId,
        gameId,
        answer,
      },
    }
  );

  return result.data?.right || false;
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
      let fetcher = supabaseClient.from("active_game").select().eq("ended", false);

      if (gameId) {
        fetcher = fetcher.eq("id", gameId);
      }

      fetcher = fetcher.order("start_at", { ascending: false })

      const result = await fetcher;
      if (result.error) {
        console.error(result.error);
        setError(result.error.message);
      } else {
        setData(result.data);
      }
      setFetching(false);
    }

    channel.current?.unsubscribe();

    initialFetch();

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
          if (payload.eventType === "INSERT") {
            setData((prevState) =>
              prevState !== undefined
                ? [payload.new, ...prevState]
                : [payload.new]
            );
          } else if (payload.eventType === "UPDATE") {
            setData((prevState) =>
              prevState?.map((item) =>
                item.id === payload.old.id ? payload.new : item
              )
            );
          } else {
            console.log(payload);
          }
        }
      )
      .subscribe();
  }, [gameId]);

  return { fetching, error, data };
}

export function usePlayerGames(playerId: string, gameId: string) {
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();
  const channel = useRef<RealtimeChannel>();

  useEffect(
    () => () => {
      channel.current?.unsubscribe();
    },
    []
  );

  useEffect(() => {
    if (!gameId || !playerId) return;

    async function initialFetch() {
      setFetching(true);
      const result = await supabaseClient
        .from("player_game")
        .select()
        .eq("player_id", playerId)
        .eq("game_id", gameId);

      if (result.error) {
        console.error(result.error);
        setError(result.error.message);
      } else {
        setData(result.data);
      }
      setFetching(false);
    }

    channel.current?.unsubscribe();

    initialFetch();

    channel.current = supabaseClient
      .channel("schema-db-changes")
      .on(
        `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
        {
          event: "*",
          schema: "public",
          table: "player_game",
          filter: `player_id=eq.${playerId}`,
        },
        (payload) => {
          const data = payload.new as { [key: string]: any };
          if (data.game_id === gameId && (payload.eventType === "UPDATE" || payload.eventType === "INSERT")) {
            setData(data);
          } else {
            console.log(payload);
          }
        }
      )
      .subscribe();
  }, [playerId, gameId]);

  return { fetching, error, data };
}

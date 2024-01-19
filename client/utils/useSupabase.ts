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

export function useGames() {
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();
  const channel = useRef<RealtimeChannel>();

  useEffect(() => {
    async function initialFetch() {
      setFetching(true);
      const result = await supabaseClient
        .from("active_game")
        .select()
        .eq("ended", false)
        .order("start_at", { ascending: false });

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
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((prevState: any) =>
              prevState !== undefined
                ? [payload.new, ...prevState]
                : [payload.new]
            );
          } else if (payload.eventType === "UPDATE") {
            setData((prevState: any) =>
              prevState?.map((item: any) =>
                item.id === payload.old.id ? payload.new : item
              )
            );
          } else {
            console.log(payload);
          }
        }
      )
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  return { fetching, error, data };
}

export function useGame(playerId: string, gameId: string) {
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>();
  const [playerGame, setPlayerGame] = useState<any>();
  const [activeGame, setActiveGame] = useState<any>();
  const channel = useRef<RealtimeChannel>();

  useEffect(() => {
    if (!gameId || !playerId) return;

    async function initialFetch() {
      setFetching(true);
      const playerGame = await supabaseClient
        .from("player_game")
        .select()
        .eq("player_id", playerId)
        .eq("game_id", gameId);
      const activeGame = await supabaseClient
        .from("active_game")
        .select()
        .eq("ended", false)
        .eq("id", gameId);

      if (activeGame.error) {
        console.error(activeGame.error);
        setError(activeGame.error.message);
      } else if (activeGame.data.length < 1) {
        setError("active game not found");
      } else {
        setActiveGame(activeGame.data[0]);
      }

      if (playerGame.error) {
        console.error(playerGame.error);
        setError(playerGame.error.message);
      } else if (playerGame.data.length < 1) {
        setError("player game not found");
      } else {
        setPlayerGame(playerGame.data[0]);
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
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setActiveGame(payload.new);
          } else {
            console.log(payload);
          }
        }
      )
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
          if (
            data.game_id === gameId &&
            (payload.eventType === "UPDATE" || payload.eventType === "INSERT")
          ) {
            setPlayerGame(data);
          } else {
            console.log(payload);
          }
        }
      )
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [playerId, gameId]);

  return { fetching, error, activeGame, playerGame };
}

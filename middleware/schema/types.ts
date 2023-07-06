import { type Database } from './database.types.ts';

/**
 * Custom mapping for our models
 *
 * You could also check out this lib + discussion about generating these mappings:
 * - https://github.com/FroggyPanda/better-supabase-types
 * - https://github.com/orgs/supabase/discussions/13364
 */

type ActiveGame = Database['public']['Tables']['active_game']['Row'];
type Game = Database['public']['Tables']['game']['Row'];
type GameQuestion = Database['public']['Tables']['game_question']['Row'];
type Player = Database['public']['Tables']['player']['Row'];
type PlayerGame = Database['public']['Tables']['player_game']['Row'];
type Question = Database['public']['Tables']['question']['Row'];

export type { ActiveGame, Game, GameQuestion, Player, PlayerGame, Question };

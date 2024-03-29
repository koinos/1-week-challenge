export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      active_game: {
        Row: {
          answer: boolean | null;
          ended: boolean;
          id: string;
          participant_count: number;
          players_remaining: number;
          question: string | null;
          question_id: string | null;
          real_fact_if_fiction: string | null;
          rewards: string | null;
          right_count: number;
          round: number;
          round_ends: number;
          start_at: number;
          winner: string | null;
          wrong_count: number;
        };
        Insert: {
          answer?: boolean | null;
          ended?: boolean;
          id?: string;
          participant_count?: number;
          players_remaining?: number;
          question?: string | null;
          question_id?: string | null;
          real_fact_if_fiction?: string | null;
          rewards?: string | null;
          right_count?: number;
          round?: number;
          round_ends: number;
          start_at: number;
          winner?: string | null;
          wrong_count?: number;
        };
        Update: {
          answer?: boolean | null;
          ended?: boolean;
          id?: string;
          participant_count?: number;
          players_remaining?: number;
          question?: string | null;
          question_id?: string | null;
          real_fact_if_fiction?: string | null;
          rewards?: string | null;
          right_count?: number;
          round?: number;
          round_ends?: number;
          start_at?: number;
          winner?: string | null;
          wrong_count?: number;
        };
      };
      game: {
        Row: {
          active: boolean;
          id: string;
          participant_count: number | null;
          rewards: string;
          start_at: number;
          winner: string | null;
        };
        Insert: {
          active?: boolean;
          id?: string;
          participant_count?: number | null;
          rewards: string;
          start_at: number;
          winner?: string | null;
        };
        Update: {
          active?: boolean;
          id?: string;
          participant_count?: number | null;
          rewards?: string;
          start_at?: number;
          winner?: string | null;
        };
      };
      game_question: {
        Row: {
          game_id: string;
          id: string;
          question_id: string;
          right_count: number;
          round: number;
          started_count: number;
          wrong_count: number;
        };
        Insert: {
          game_id: string;
          id?: string;
          question_id: string;
          right_count?: number;
          round: number;
          started_count: number;
          wrong_count?: number;
        };
        Update: {
          game_id?: string;
          id?: string;
          question_id?: string;
          right_count?: number;
          round?: number;
          started_count?: number;
          wrong_count?: number;
        };
      };
      player: {
        Row: {
          created_at: string | null;
          game_count: number;
          id: string;
          win_count: number;
        };
        Insert: {
          created_at?: string | null;
          game_count?: number;
          id: string;
          win_count?: number;
        };
        Update: {
          created_at?: string | null;
          game_count?: number;
          id?: string;
          win_count?: number;
        };
      };
      player_game: {
        Row: {
          answers: Json;
          eliminated: boolean;
          game_id: string;
          id: string;
          player_id: string;
          rewards: string | null;
          round: number;
        };
        Insert: {
          answers?: Json;
          eliminated?: boolean;
          game_id: string;
          id?: string;
          player_id: string;
          rewards?: string | null;
          round?: number;
        };
        Update: {
          answers?: Json;
          eliminated?: boolean;
          game_id?: string;
          id?: string;
          player_id?: string;
          rewards?: string | null;
          round?: number;
        };
      };
      question: {
        Row: {
          id: string;
          is_fact: boolean;
          question: string;
          real_fact_if_fiction: string | null;
        };
        Insert: {
          id?: string;
          is_fact: boolean;
          question: string;
          real_fact_if_fiction?: string | null;
        };
        Update: {
          id?: string;
          is_fact?: boolean;
          question?: string;
          real_fact_if_fiction?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      pick_random_question: {
        Args: {
          game_id: string;
        };
        Returns: {
          id: string;
          is_fact: boolean;
          question: string;
          real_fact_if_fiction: string | null;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

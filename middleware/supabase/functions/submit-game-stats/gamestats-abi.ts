import { type Abi } from 'https://esm.sh/koilib@v5.5.6?target=deno';

export const GamestatsAbi: Abi = {
  methods: {
    initialize: {
      argument: 'gamestats.initialize_arguments',
      return: 'gamestats.empty_message',
      description: 'Initialize the contract',
      entry_point: 1192148610,
      read_only: false,
    },
    submit_game_stats: {
      argument: 'gamestats.submit_game_stats_arguments',
      return: 'gamestats.empty_message',
      description: 'Submit game stats',
      entry_point: 3589966174,
      read_only: false,
    },
    get_player_info: {
      argument: 'gamestats.get_player_info_arguments',
      return: 'gamestats.player_object',
      description: "Return a player's info",
      entry_point: 2950184877,
      read_only: true,
    },
    get_leaderboard: {
      argument: 'gamestats.get_leaderboard_arguments',
      return: 'gamestats.get_leaderboard_result',
      description: 'Return the leaderboard',
      entry_point: 2157256597,
      read_only: true,
    },
    get_games_stats: {
      argument: 'gamestats.get_games_stats_arguments',
      return: 'gamestats.get_games_stats_result',
      description: 'Return the past games stats',
      entry_point: 1885616903,
      read_only: true,
    },
  },
  types: {
    nested: {
      gamestats: {
        nested: {
          empty_message: {
            fields: {},
          },
          initialize_arguments: {
            fields: {
              rewards_token_address: {
                type: 'bytes',
                id: 1,
                options: {
                  '(koinos.btype)': 'CONTRACT_ID',
                },
              },
            },
          },
          submit_game_stats_arguments: {
            fields: {
              game_stats: {
                type: 'game_stats_object',
                id: 1,
              },
            },
          },
          get_player_info_arguments: {
            fields: {
              player: {
                type: 'bytes',
                id: 1,
                options: {
                  '(koinos.btype)': 'ADDRESS',
                },
              },
            },
          },
          get_leaderboard_arguments: {
            fields: {
              offset_key: {
                type: 'leaderboard_key',
                id: 1,
              },
              limit: {
                type: 'uint64',
                id: 2,
                options: {
                  jstype: 'JS_STRING',
                },
              },
              least_to_most_wins: {
                type: 'bool',
                id: 3,
              },
            },
          },
          get_leaderboard_result: {
            fields: {
              leaderboard: {
                rule: 'repeated',
                type: 'leaderboard_key',
                id: 1,
              },
            },
          },
          get_games_stats_arguments: {
            fields: {
              offset_key: {
                type: 'game_stats_key',
                id: 1,
              },
              limit: {
                type: 'uint64',
                id: 2,
                options: {
                  jstype: 'JS_STRING',
                },
              },
              oldest_to_newest: {
                type: 'bool',
                id: 3,
              },
            },
          },
          get_games_stats_result: {
            fields: {
              games_stats: {
                rule: 'repeated',
                type: 'game_stats_object',
                id: 1,
              },
            },
          },
          metadata_object: {
            fields: {
              initialized: {
                type: 'bool',
                id: 1,
              },
              rewards_token_address: {
                type: 'bytes',
                id: 2,
                options: {
                  '(koinos.btype)': 'ADDRESS',
                },
              },
              last_game_id: {
                type: 'uint64',
                id: 3,
              },
            },
          },
          game_stats_key: {
            fields: {
              game_id: {
                type: 'uint64',
                id: 1,
              },
            },
          },
          game_stats_object: {
            fields: {
              game_id: {
                type: 'uint64',
                id: 1,
                options: {
                  jstype: 'JS_STRING',
                },
              },
              timestamp: {
                type: 'uint64',
                id: 2,
                options: {
                  jstype: 'JS_STRING',
                },
              },
              rewards: {
                type: 'uint64',
                id: 3,
                options: {
                  jstype: 'JS_STRING',
                },
              },
              winner: {
                type: 'bytes',
                id: 4,
                options: {
                  '(koinos.btype)': 'ADDRESS',
                },
              },
            },
          },
          leaderboard_key: {
            fields: {
              wins: {
                type: 'uint32',
                id: 1,
              },
              player: {
                type: 'bytes',
                id: 2,
              },
            },
          },
          player_object: {
            fields: {
              wins: {
                type: 'uint32',
                id: 1,
              },
            },
          },
        },
      },
    },
  },
};

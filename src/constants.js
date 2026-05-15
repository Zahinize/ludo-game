let defaultGameState = {
  hasGameStarted: false,
  activeTurn: 'user', // which player has the current turn, user/computer
  userDice: {
    first: null,
    second: null,
  },
  computerDice: {
    first: null,
    second: null,
  },
  userTokens: {},
  computerTokens: {},
  winner: null,
};
const LS_USER_INFO_KEY = '_LH_D_';

export { defaultGameState, LS_USER_INFO_KEY };

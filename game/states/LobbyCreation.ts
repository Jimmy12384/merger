import { GameState, GameAction, Action, BaseGameState } from "../logic";
const LOBBY_CREATION = "LOBBY_CREATION";
const LobbyCreation = (currentState: BaseGameState): GameState => {
	const startGame = (action: GameAction): GameState => {
		return LobbyCreation(currentState);
	};

	return {
		...currentState,
		state: LOBBY_CREATION,
		resolveAction: (action: Action): GameState => {
			switch (action.type) {
				case "START_GAME":
					return startGame(action);
				default:
					throw new Error("Unsupported Operation");
			}
		},
	} as GameState;
};

export default LobbyCreation;

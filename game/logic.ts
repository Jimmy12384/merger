import LobbyCreation from "./states/LobbyCreation";

// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
	return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
		0,
		MAX_LOG_SIZE
	);
};

// If there is anything you want to track for a specific user, change this interface
export interface User {
	id: string;
}

// Do not change this! Every game has a list of users and log of actions
export interface BaseGameState {
	users: User[];
	log: {
		dt: number;
		message: string;
	}[];
}

// Do not change!
export type Action = DefaultAction | GameAction;

// Do not change!
export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

// The maximum log size, change as needed
const MAX_LOG_SIZE = 4;

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
	state: String;
	resolveAction: (action: GameAction) => GameState;
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = () =>
	LobbyCreation({
		users: [],
		log: addLog("Game Created!", []),
	});

// Here are all the actions we can dispatch for a user
export type GameAction = { type: string; value: object };

export const gameUpdater = (
	action: ServerAction,
	state: GameState
): GameState => {
	switch (action.type) {
		case "UserEntered":
			return {
				...state,
				users: [...state.users, action.user],
				log: addLog(`user ${action.user.id} joined 🎉`, state.log),
			};

		case "UserExit":
			return {
				...state,
				users: state.users.filter((user) => user.id !== action.user.id),
				log: addLog(`user ${action.user.id} left 😢`, state.log),
			};

		// All other actions should be a game action
		default:
			try {
				return state.resolveAction(action as GameAction);
			} catch (e) {
				return {
					...state,
					log: addLog(
						`user ${action.user.id} performed an invalid action! They are sus.`,
						state.log
					),
				};
			}
	}
};

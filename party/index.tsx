import type * as Party from "partykit/server";

import { gameUpdater, initialGame, Action, ServerAction } from "../game/logic";
import { GameState } from "../game/logic";

interface ServerMessage {
	state: GameState;
}

/**
 * Web Socket implementation for user session management.
 */
export default class Server implements Party.Server {
	private gameState: GameState;

	/**
	 * Creates a new party room
	 *
	 * @param party the party to initialize
	 */
	constructor(readonly party: Party.Room) {
		this.gameState = initialGame();
		console.log("Room created:", party.id);
	}

	/**
	 * Event handler for when a user connection is initiated. Creates the user in the game state and
	 * broadcasts the game state to all users.
	 *
	 * @param connection the user connection to initialize
	 * @param ctx the party context
	 */
	onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
		this.gameState = gameUpdater(
			{ type: "UserEntered", user: { id: connection.id } },
			this.gameState
		);
		this.party.broadcast(JSON.stringify(this.gameState));
	}

	/**
	 * Event handler for when a connection is terminated for a user connection. Terminates the user
	 * session from the game state and broadcasts the game state to all users.
	 *
	 * @param connection the user connection to terminate
	 */
	onClose(connection: Party.Connection) {
		this.gameState = gameUpdater(
			{
				type: "UserExit",
				user: { id: connection.id },
			},
			this.gameState
		);
		this.party.broadcast(JSON.stringify(this.gameState));
	}

	/**
	 * Event handler for when a user connection sends a message to the server. Parses the message
	 * as a {@link ServerAction} and updates the game state accordingly.
	 *
	 * @param message the serialized message
	 * @param sender the user connection that sent the message
	 */
	onMessage(message: string, sender: Party.Connection) {
		const action: ServerAction = {
			...(JSON.parse(message) as Action),
			user: { id: sender.id },
		};
		console.log(`Received action ${action.type} from user ${sender.id}`);
		this.gameState = gameUpdater(action, this.gameState);
		this.party.broadcast(JSON.stringify(this.gameState));
	}
}

Server satisfies Party.Worker;

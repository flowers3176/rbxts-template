/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Networking } from "@flamework/networking";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	hydrateUserData(userData: UserData): void;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();

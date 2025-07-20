import type { OnStart } from "@flamework/core";
import { Flamework, Service } from "@flamework/core";
import Signal from "@rbxts/lemon-signal";
import type { LogMessage } from "@rbxts/lyra";
import { createPlayerStore } from "@rbxts/lyra";
import type { MigrationChain } from "@rbxts/lyra/src/store";
import { Players } from "@rbxts/services";
import { Events } from "server/networking";
import { defaultUserData } from "shared/config/default-userdata";
import { createLifecycle } from "shared/utils/create-lifecycle";

import type { OnPlayerAdded, OnPlayerRemoving } from "./player-service";

export interface OnStoreLoaded {
	onStoreLoaded(player: Player): void;
}

export interface OnStoreUpdated {
	onStoreUpdated(player: Player, currentData: UserData, oldData: undefined | UserData): void;
}

export interface OnStoreUnloaded {
	onStoreUnloaded(player: Player): void;
}

@Service()
export class DataService implements OnPlayerAdded, OnPlayerRemoving, OnStart, OnStoreUpdated {
	private readonly guard = Flamework.createGuard<UserData>();
	private readonly migrations: MigrationChain<UserData> = [];
	private readonly onStoreLoadedSignal = new Signal<(player: Player) => void>();
	private readonly onStoreUnloadedSignal = new Signal<(player: Player) => void>();
	private readonly onStoreUpdatedSignal = new Signal<
		(player: Player, currentData: UserData, oldData: undefined | UserData) => void
	>();

	public readonly store = createPlayerStore<UserData>({
		changedCallbacks: [
			(...args) => {
				this.dataChangedCallback(...args);
			},
		],
		logCallback: (logMessage) => {
			this.handleLogs(logMessage);
		},
		migrationSteps: this.migrations,
		name: "PlayerStore",
		schema: this.guard,
		template: defaultUserData,
	});

	public onPlayerAdded(player: Player): void {
		void this.store
			.load(player)
			.catch(error)
			.then(() => {
				this.onStoreLoadedSignal.Fire(player);
			});
	}

	public onPlayerRemoving(player: Player): void {
		void this.store
			.unload(player)
			.catch(error)
			.then(() => {
				this.onStoreUnloadedSignal.Fire(player);
			});
	}

	public onStoreUpdated(player: Player, currentData: UserData): void {
		Events.hydrateUserData(player, currentData);
	}

	public onStart(): void {
		this.setUpLifecycles();
	}

	private setUpLifecycles(): void {
		createLifecycle<OnStoreLoaded>("onStoreLoaded", this.onStoreLoadedSignal);
		createLifecycle<OnStoreUpdated>("onStoreUpdated", this.onStoreUpdatedSignal);
		createLifecycle<OnStoreUnloaded>("onStoreUnloaded", this.onStoreUnloadedSignal);
	}

	private dataChangedCallback(key: string, currentData: UserData, oldData: undefined | UserData): void {
		const userId = tonumber(key);
		if (userId === undefined) {
			error(`Failed to convert key(${key}) to userId`);
		}

		const player = Players.GetPlayerByUserId(userId);
		if (player === undefined) {
			error(`Failed to get player from userId(${userId})`);
		}

		this.onStoreUpdatedSignal.Fire(player, currentData, oldData);
	}

	private handleLogs(logMessage: LogMessage): void {
		if (logMessage.context) {
			print(`LYRA/${logMessage.level.upper()}, ${logMessage.message}`, logMessage.context);
		} else {
			print(`LYRA/${logMessage.level.upper()}, ${logMessage.message}`);
		}
	}
}

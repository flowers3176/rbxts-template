import type { OnInit } from "@flamework/core";
import { Service } from "@flamework/core";
import Signal from "@rbxts/lemon-signal";
import { Players } from "@rbxts/services";
import { createLifecycle } from "shared/utils/create-lifecycle";

export interface OnPlayerAdded {
	onPlayerAdded(player: Player): void;
}

export interface OnPlayerRemoving {
	onPlayerRemoving(player: Player): void;
}

@Service()
export class PlayerService implements OnInit {
	private readonly playerAddedSignal = new Signal<Player>();
	private readonly playerRemovingSignal = new Signal<Player>();

	public onInit(): Promise<void> | void {
		createLifecycle<OnPlayerAdded>("onPlayerAdded", this.playerAddedSignal);
		createLifecycle<OnPlayerRemoving>("onPlayerRemoving", this.playerRemovingSignal);

		this.iterateExistingPlayers();
		this.fowardInstrictEvents();
	}

	private iterateExistingPlayers(): void {
		for (const player of Players.GetPlayers()) {
			this.playerAddedSignal.Fire(player);
		}
	}

	private fowardInstrictEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.playerAddedSignal.Fire(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.playerRemovingSignal.Fire(player);
		});
	}
}

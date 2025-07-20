import { App } from "@app/index";
import type { OnStart } from "@flamework/core";
import { Controller } from "@flamework/core";
import { StrictMode } from "@rbxts/react";
import React from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { loadOrder } from "shared/config/load-order";

@Controller({
	loadOrder: loadOrder.UIController,
})
export class UIController implements OnStart {
	onStart(): void {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<StrictMode>
					<App />
				</StrictMode>,
				playerGui,
			),
		);
	}
}

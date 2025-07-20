import type { OnStart } from "@flamework/core";
import { Controller } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { Events } from "client/networking";
import { defaultUserData } from "shared/config/default-userdata";

@Controller()
export class DataController implements OnStart {
	public readonly dataAtom = atom<UserData>(defaultUserData);

	public onStart(): void {
		Events.hydrateUserData.connect((userData) => {
			this.dataAtom(userData);
		});
	}
}

import type { DataController } from "@controllers/data-controller";
import { Dependency } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { useAtom } from "@rbxts/react-charm";
import { Environment } from "@rbxts/ui-labs";
import { defaultUserData } from "shared/config/default-userdata";

export function useUserData(): UserData {
	return useAtom(
		Environment.IsStory() === true ? atom<UserData>(defaultUserData) : Dependency<DataController>().dataAtom,
	);
}

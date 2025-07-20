import { SoundService } from "@rbxts/services";
import { Environment } from "@rbxts/ui-labs";

interface SoundFormat {
	asset: string;
	speed: number;
	volume: number;
}

const sounds = {} satisfies Record<string, SoundFormat>;

const soundCache = new Map<string, Sound>();

function makeSound(info: (typeof sounds)[keyof typeof sounds], isWidget = false): Sound {
	const { asset, speed, volume } = info;
	const sound = new Instance("Sound");
	sound.SoundId = asset;
	sound.Volume = volume;
	sound.PlaybackSpeed = speed;
	if (isWidget) {
		sound.Parent = Environment.PluginWidget;
	}

	return sound;
}

export function playSound(soundName: keyof typeof sounds): void {
	if (Environment.IsStory() === true) {
		const info = sounds[soundName];
		const sound = makeSound(info, true);
		sound.Play();
		Environment.GetJanitor()?.Add(() => {
			sound.Stop();
		});
	} else {
		let sound = soundCache.get(soundName);
		if (sound === undefined) {
			const info = sounds[soundName];
			sound = makeSound(info);
			soundCache.set(soundName, sound);
		}

		SoundService.PlayLocalSound(sound);
	}
}

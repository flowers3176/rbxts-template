import { useEventListener } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import { useBinding, useMemo } from "@rbxts/react";
import type { Motion, MotionGoal } from "@rbxts/ripple";
import { createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function useMotion(initialValue: number): LuaTuple<[Binding<number>, Motion]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]> {
	const motion = useMemo(() => createMotion(initialValue), [initialValue]);

	const [binding, setValue] = useBinding(initialValue);

	useEventListener(RunService.RenderStepped, (delta) => {
		const value = motion.step(delta);

		if (value !== binding.getValue()) {
			setValue(value);
		}
	});

	return $tuple(binding, motion);
}

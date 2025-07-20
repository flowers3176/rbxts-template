import { getBindingValue, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import { useRef } from "@rbxts/react";
import type { MotionGoal, PartialMotionGoal, SpringOptions } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import type { BindingValue } from "types/react";

export function useSpring(goal: Binding<number> | number, options?: SpringOptions): Binding<number>;

export function useSpring<T extends MotionGoal>(goal: Binding<T> | T, options?: SpringOptions): Binding<T>;

export function useSpring<T extends MotionGoal>(goal: BindingValue<T>, options?: SpringOptions): Binding<T> {
	const [binding, motion] = useMotion(getBindingValue(goal));
	const previousValue = useRef(getBindingValue(goal));

	useEventListener(RunService.Heartbeat, () => {
		const currentValue = getBindingValue(goal);

		if (currentValue !== previousValue.current) {
			previousValue.current = currentValue;
			motion.spring(currentValue as PartialMotionGoal<NonNullable<T>>, options);
		}
	});

	return binding;
}

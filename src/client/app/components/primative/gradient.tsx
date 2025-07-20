import { toBinding } from "@rbxts/pretty-react-hooks";
import type { Binding, Element } from "@rbxts/react";
import React, { joinBindings } from "@rbxts/react";
import type { BindingValue } from "types/react";

interface GradientProps {
	color?: BindingValue<Color3>[];
	offset?: BindingValue<Vector2>;
	rotation?: BindingValue<number>;
	transparency?: BindingValue<number>[];
}

type Keypoint<T extends Color3 | number> = T extends Color3 ? ColorSequenceKeypoint : NumberSequenceKeypoint;
type Sequence<T extends Color3 | number> = T extends Color3 ? ColorSequence : NumberSequence;
type KeypointConstructor<T extends Color3 | number> = new (time: number, value: T) => Keypoint<T>;
type SequenceConstructor<T extends Color3 | number> = new (args: Keypoint<T>[]) => Sequence<T>;

const notEnoughInputsErr = "Gradients needs one or more keypoint inputs";

function solveBindingsSequence<T extends Color3 | number>(
	bindingValues: BindingValue<T>[],
): Binding<Sequence<T>> | undefined {
	const size = bindingValues.size();
	if (size === 0) return error(notEnoughInputsErr);
	const bindings = bindingValues.map(toBinding);
	const isColor3 = typeIs(bindings[0] ?? error(notEnoughInputsErr), "Color3");
	const [sequenceConstructor, keypointConstructor] = (isColor3
		? [ColorSequence, ColorSequenceKeypoint]
		: [NumberSequence, NumberSequenceKeypoint]) as unknown as [SequenceConstructor<T>, KeypointConstructor<T>];

	const toKeypoints = (values: T[]) => {
		const first = values.shift();
		if (first === undefined) error(notEnoughInputsErr);
		const last = values.pop() ?? first;
		if (size <= 2)
			return new sequenceConstructor([new keypointConstructor(0, first), new keypointConstructor(1, last)]);

		const step = 1 / (size - 1);
		const toKeypoint = (value: T, index: number) => new keypointConstructor(step * (1 + index), value);
		const rest = values.map(toKeypoint);

		return new sequenceConstructor([new keypointConstructor(0, first), ...rest, new keypointConstructor(0, last)]);
	};

	return joinBindings(bindings).map(toKeypoints);
}

export function Gradient({ color, offset, rotation, transparency }: GradientProps): Element {
	const colorSequence = color ? solveBindingsSequence(color) : new ColorSequence(new Color3(1, 1, 1));
	const transparencySequence = transparency ? solveBindingsSequence(transparency) : new NumberSequence(0);

	return <uigradient Color={colorSequence} Offset={offset} Rotation={rotation} Transparency={transparencySequence} />;
}

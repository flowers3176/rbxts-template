import { getBindingValue, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import type { Binding, Element } from "@rbxts/react";
import React, { useMemo, useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";

interface TransitionProps extends React.PropsWithChildren {
	anchorPoint?: Binding<Vector2> | Vector2;
	change?: React.InstanceChangeEvent<CanvasGroup | Frame>;
	children?: React.ReactNode;
	clipsDescendants?: Binding<boolean> | boolean;
	directChildren?: React.ReactNode;
	event?: React.InstanceEvent<CanvasGroup | Frame>;
	groupColor?: Binding<Color3> | Color3;
	groupTransparency?: Binding<number> | number;
	layoutOrder?: Binding<number> | number;
	position?: Binding<UDim2> | UDim2;
	rotation?: Binding<number> | number;
	size?: Binding<UDim2> | UDim2;
	zIndex?: Binding<number> | number;
}

const EPSILON = 0.03;

export function Transition({
	anchorPoint,
	change,
	children,
	clipsDescendants,
	directChildren,
	event,
	groupColor = new Color3(1, 1, 1),
	groupTransparency,
	layoutOrder,
	position,
	rotation,
	size = new UDim2(1, 0, 1, 0),
	zIndex,
}: TransitionProps): Element {
	const [frame, setFrame] = useState<Frame>();
	const [canvas, setCanvas] = useState<CanvasGroup>();

	const container = useMemo(() => {
		const container = new Instance("Frame");
		container.Size = new UDim2(1, 0, 1, 0);
		container.BackgroundTransparency = 1;
		return container;
	}, []);

	useEventListener(RunService.Heartbeat, () => {
		const transparency = getBindingValue(groupTransparency) ?? 0;
		pcall(() => {
			container.Parent = transparency > EPSILON ? canvas : frame;
		});
	});

	useUnmountEffect(() => {
		container.Destroy();
	});

	return (
		<frame
			AnchorPoint={anchorPoint}
			BackgroundTransparency={1}
			LayoutOrder={layoutOrder}
			Position={position}
			Rotation={rotation}
			Size={size}
			ZIndex={zIndex}
		>
			{createPortal(<>{children}</>, container)}

			<canvasgroup
				ref={setCanvas}
				BackgroundTransparency={1}
				Change={change}
				Event={event}
				GroupColor3={groupColor}
				GroupTransparency={groupTransparency}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</canvasgroup>

			<frame
				ref={setFrame}
				BackgroundTransparency={1}
				Change={change}
				ClipsDescendants={clipsDescendants}
				Event={event}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</frame>
		</frame>
	);
}

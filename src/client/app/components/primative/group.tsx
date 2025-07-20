import React, { forwardRef } from "@rbxts/react";
import type { BindingValue } from "types/react";

interface GroupProps extends React.PropsWithChildren {
	ref?: React.Ref<Frame>;
	event?: React.InstanceEvent<Frame>;
	change?: React.InstanceChangeEvent<Frame>;
	size?: BindingValue<UDim2>;
	position?: BindingValue<UDim2>;
	anchorPoint?: BindingValue<Vector2>;
	rotation?: BindingValue<number>;
	clipsDescendants?: BindingValue<boolean>;
	layoutOrder?: BindingValue<number>;
	visible?: BindingValue<boolean>;
	zIndex?: BindingValue<number>;
}

export const Group = forwardRef((props: GroupProps, ref: React.Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			key={"Group"}
			Size={props.size || UDim2.fromScale(1, 1)}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			ClipsDescendants={props.clipsDescendants}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			BackgroundTransparency={1}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
		</frame>
	);
});

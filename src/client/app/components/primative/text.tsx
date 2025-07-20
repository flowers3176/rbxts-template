import { usePx } from "@hooks/use-px";
import type { ReactNode } from "@rbxts/react";
import React from "@rbxts/react";
import type { BindingValue } from "types/react";

export interface TextProps<T extends Instance = TextLabel> {
	font?: Font;
	text?: BindingValue<string>;
	textColor?: BindingValue<Color3>;
	textSize?: BindingValue<number>;
	textTransparency?: BindingValue<number>;
	textWrapped?: BindingValue<boolean>;
	textXAlignment?: React.InferEnumNames<Enum.TextXAlignment>;
	textYAlignment?: React.InferEnumNames<Enum.TextYAlignment>;
	textTruncate?: React.InferEnumNames<Enum.TextTruncate>;
	textScaled?: BindingValue<boolean>;
	textHeight?: BindingValue<number>;
	textAutoResize?: "X" | "Y" | "XY";
	richText?: BindingValue<boolean>;
	maxVisibleGraphemes?: BindingValue<number>;
	size?: BindingValue<UDim2>;
	position?: BindingValue<UDim2>;
	anchorPoint?: BindingValue<Vector2>;
	visible?: BindingValue<boolean>;
	zIndex?: BindingValue<number>;
	layoutOrder?: BindingValue<number>;
	event?: React.InstanceEvent<T>;
	change?: React.InstanceChangeEvent<T>;
	children?: ReactNode;
}

export function Text(props: TextProps) {
	const rem = usePx();

	return (
		<textlabel
			Font={Enum.Font.Unknown}
			FontFace={props.font || Font.fromEnum(Enum.Font.SourceSans)}
			Text={props.text}
			TextColor3={props.textColor}
			TextSize={props.textSize ?? rem(1)}
			TextTransparency={props.textTransparency}
			TextWrapped={props.textWrapped}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			TextTruncate={props.textTruncate}
			TextScaled={props.textScaled}
			LineHeight={props.textHeight}
			RichText={props.richText}
			MaxVisibleGraphemes={props.maxVisibleGraphemes}
			Size={props.size}
			AutomaticSize={props.textAutoResize}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundTransparency={1}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			Change={props.change}
			Event={props.event}
		>
			{props.children}
		</textlabel>
	);
}

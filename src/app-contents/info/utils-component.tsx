import { TooltipProps } from '@mui/material';

export function tooltipProps(
	props: Omit<TooltipProps, 'children'>,
): Omit<TooltipProps, 'children'> {
	return {
		slotProps: { tooltip: { sx: { whiteSpace: 'nowrap', pr: 2 } } },
		...props,
	};
}

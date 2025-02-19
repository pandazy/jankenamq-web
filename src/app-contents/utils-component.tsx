import { TooltipProps } from '@mui/material';

export const DefaultTooltipProps: Omit<TooltipProps, 'children' | 'title'> = {
	slotProps: {
		tooltip: { sx: { whiteSpace: 'nowrap', maxWidth: '1000px' } },
	},
};

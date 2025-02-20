import { Functions } from '@mui/icons-material';
import { Badge, Pagination, Stack, Tooltip } from '@mui/material';
import { ReactElement } from 'react';

export interface PaginatorProps {
	total: number;
	page: number;
	turnToPage: (page: number) => void;
	totalPages: number;
}

export function Paginator({
	total,
	page,
	turnToPage,
	totalPages,
}: PaginatorProps): ReactElement {
	return (
		<Stack direction="row" spacing={2} alignItems="center">
			<Tooltip title="Total amount of records">
				<Badge
					badgeContent={total}
					color="primary"
					sx={{ p: 0.7 }}
					max={999999999999999}
				>
					<Functions />
				</Badge>
			</Tooltip>
			<Pagination
				count={totalPages}
				page={page + 1}
				showFirstButton
				showLastButton
				onChange={(_, value) => turnToPage(value - 1)}
			/>
		</Stack>
	);
}

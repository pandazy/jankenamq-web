import { useLearnTheSong } from './api-calls';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { DefaultTooltipProps } from '~/app-contents/utils-component';

import {
	Tooltip,
	Chip,
	Button,
	Typography,
	Stack,
	TooltipProps,
} from '@mui/material';
import {
	Repeat,
	SchoolOutlined,
	LocalLibraryTwoTone,
} from '@mui/icons-material';

import {
	PopButton,
	PopCard,
	PopCardProps,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import { ReactElement, ReactNode } from 'react';
import LevelUpButton from './LevelUpButton';

function ConfirmAddToLearningButton({
	song,
}: {
	song: SchemaDataRow;
}): ReactElement {
	const { mutate: learnTheSong, isPending } = useLearnTheSong(
		song?.id as string,
	);

	return (
		<Button
			variant="contained"
			color="primary"
			sx={{ width: 'fit-content' }}
			onClick={() => learnTheSong()}
			disabled={isPending}
		>
			YES
		</Button>
	);
}

interface AddToLearningButtonProps {
	song: SchemaDataRow;
	children: ReactNode;
	popCardProps?: PopCardProps;
	tooltipProps?: Omit<TooltipProps, 'children'>;
}

function AddToLearningButton({
	song,
	popCardProps,
	children,
	tooltipProps,
}: AddToLearningButtonProps): ReactElement {
	return (
		<PopButton
			tooltipProps={{
				...DefaultTooltipProps,
				...(tooltipProps ?? ({} as TooltipProps)),
			}}
			popoverContent={
				<PopCard {...popCardProps}>
					<Stack spacing={2} sx={{ p: 2 }}>
						<Typography sx={{ p: 2 }}>
							Confirm to add the song <b>{song.name}</b> to your
							learning list.
						</Typography>
						<Stack direction="row" spacing={2}>
							<ConfirmAddToLearningButton song={song} />
						</Stack>
					</Stack>
				</PopCard>
			}
		>
			{children}
		</PopButton>
	);
}

export default function LearningSection({
	song,
	learning,
}: {
	song: SchemaDataRow;
	learning?: SchemaDataRowParented;
}): ReactElement {
	return (
		<>
			{learning && (
				<>
					{Boolean(parseInt(learning.graduated as string)) && (
						<>
							<Tooltip
								{...DefaultTooltipProps}
								title="You have learned this song"
							>
								<Chip
									icon={
										<SchoolOutlined
											sx={{ fill: 'white' }}
										/>
									}
									label="✔"
									sx={{
										ml: 2,
										backgroundColor: 'success.light',
										color: 'white',
									}}
								/>
							</Tooltip>
							<AddToLearningButton
								song={song}
								tooltipProps={{
									title: 'Re-learn this song',
								}}
								popCardProps={{
									header: 'Re-learn this song',
								}}
							>
								<Repeat />
							</AddToLearningButton>
						</>
					)}
					{!parseInt(learning.graduated as string) && (
						<>
							<LevelUpButton
								song={song as SchemaDataRow}
								learning={learning as SchemaDataRow}
							/>
						</>
					)}
				</>
			)}
			{!learning && (
				<Stack spacing={0}>
					<AddToLearningButton
						song={song}
						popCardProps={{
							header: 'Add to learning list',
						}}
						tooltipProps={{
							title: 'Add to learning list',
						}}
					>
						<LocalLibraryTwoTone />
						<Typography>+</Typography>
					</AddToLearningButton>
				</Stack>
			)}
		</>
	);
}

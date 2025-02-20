import { graduate, levelTo } from './api-calls';

import { DefaultTooltipProps } from '~/app-contents/utils-component';
import { QueryKeys } from '~/app-contents/info/query-keys';

import {
	PopButton,
	PopCard,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import {
	Alert,
	Avatar,
	Badge,
	Button,
	ButtonProps,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
	ListItem,
	Slider,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	AccessTimeTwoTone,
	ArrowDownward,
	ArrowUpward,
	DoubleArrowTwoTone,
	MilitaryTech,
	SchoolTwoTone,
} from '@mui/icons-material';
import { ReactElement, ReactNode, useEffect, useState } from 'react';

function getMaxLevel(learning: SchemaDataRow) {
	const pathArray = JSON.parse(learning.level_up_path as string);
	return pathArray.length - 1;
}

function getTimeUntilNextLevel(learning: SchemaDataRow): number {
	const now = Date.now();
	const day = 24 * 60 * 60;
	const path = JSON.parse(learning.level_up_path as string) as number[];

	const waitSecInterval =
		learning.level === 0 ? 5 * 60 : day * path[learning.level as number];
	const waitStartSec =
		learning.last_level_up_at === 0
			? (learning.updated_at as number)
			: (learning.last_level_up_at as number);
	const elapsedSec = Math.round(now / 1000) - waitStartSec;
	const untilNextLevelSec = waitSecInterval - elapsedSec;

	return untilNextLevelSec;
}

function getTimeUntilNextLevelDisplay(nextLevelSec: number): string {
	const day = 24 * 60 * 60;
	const hour = 60 * 60;
	const minute = 60;

	if (nextLevelSec > day) {
		return `${Math.ceil(nextLevelSec / day)}d`;
	}
	if (nextLevelSec > hour) {
		return `${Math.ceil(nextLevelSec / hour)}h`;
	}
	if (nextLevelSec > minute) {
		return `${Math.ceil(nextLevelSec / minute)}m`;
	}
	return `expired`;
}

interface LevelTo1ButtonProps {
	disabled: boolean;
	direction: 'up' | 'down';
	onClick: () => void;
}

function LevelTo1Button({
	disabled,
	direction,
	onClick,
}: LevelTo1ButtonProps): ReactElement {
	return (
		<Tooltip
			{...DefaultTooltipProps}
			title={
				<span>
					{direction === 'up'
						? 'Increase your level by 1'
						: 'Decrease your level by 1'}
				</span>
			}
		>
			<Button
				component={disabled ? 'div' : 'button'}
				variant="contained"
				sx={{
					cursor: disabled ? 'not-allowed' : 'pointer',
					opacity: disabled ? 0.7 : 1,
				}}
				color={direction === 'up' ? 'primary' : 'secondary'}
				onClick={onClick}
				disabled={disabled}
			>
				{direction === 'up' ? <ArrowUpward /> : <ArrowDownward />}
			</Button>
		</Tooltip>
	);
}

export interface LevelUpCardProps {
	song: SchemaDataRow;
	learning: SchemaDataRow;
	onApplySliderChange: (value: number) => void;
	sliderDisabled?: boolean;
	graduateButtonProps?: ButtonProps;
	confirmGraduate?: boolean;
}

export function LevelUpCard({
	song,
	learning,
	onApplySliderChange,
	sliderDisabled,
	graduateButtonProps,
	confirmGraduate = true,
}: LevelUpCardProps): ReactElement {
	const currentDisplayLevel = (learning.level as number) + 1;
	const [displayLevel, setDisplayLevel] = useState(currentDisplayLevel);
	const [sliderValue, setSliderValue] = useState(currentDisplayLevel);
	const maxLevel = getMaxLevel(learning);
	useEffect(() => {
		const newCurrentDisplayLevel = (learning.level as number) + 1;
		setDisplayLevel(newCurrentDisplayLevel);
		setSliderValue(newCurrentDisplayLevel);
		if (learning.level === maxLevel) {
			setDialogContent(
				<Stack alignItems="center">
					<Alert severity="success">
						<b>{song.name}</b>'s level is&nbsp; <b>maxed out</b>
						<br />
					</Alert>
					<Stack direction="row" alignItems="center">
						Graduate
						<SchoolTwoTone />?
					</Stack>
				</Stack>,
			);
			setConfirmGraduateDialogOpen(true);
		}
	}, [learning.level, maxLevel, song.name]);

	const [confirmGraduateDialogOpen, setConfirmGraduateDialogOpen] =
		useState(false);
	const [dialogContent, setDialogContent] = useState<ReactNode>(null);
	return (
		<PopCard
			header={
				<>
					You are currently learning <b>{song.name}</b> at:
				</>
			}
		>
			<Dialog
				open={confirmGraduateDialogOpen}
				onClose={() => setConfirmGraduateDialogOpen(false)}
			>
				<DialogTitle>Want to graduate?</DialogTitle>
				<DialogContent>
					<DialogContentText>{dialogContent}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmGraduateDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={(e) => {
							setConfirmGraduateDialogOpen(false);
							graduateButtonProps?.onClick?.(e);
						}}
					>
						✓ OK
					</Button>
				</DialogActions>
			</Dialog>
			<List>
				<ListItem>
					<Stack>
						<Stack direction="row" alignItems="center">
							Level{' '}
							<Avatar sx={{ width: 40, height: 40, ml: 1 }}>
								{displayLevel}
							</Avatar>
						</Stack>
						<Typography variant="caption" sx={{ mt: 3 }}>
							To change your level, you can:
						</Typography>
					</Stack>
				</ListItem>
				<ListItem>
					<Stack direction="column">
						<Stack
							direction="row"
							sx={{ width: '100%', py: 3 }}
							spacing={1}
							justifyContent="space-between"
							alignItems="center"
						>
							<LevelTo1Button
								direction="down"
								onClick={() => {
									setSliderValue(sliderValue - 1);
								}}
								disabled={Boolean(
									sliderDisabled || sliderValue <= 1,
								)}
							/>
							<Tooltip
								{...DefaultTooltipProps}
								title="Select a level between 1 and 20"
							>
								<Slider
									sx={{ ml: 2, minWidth: 300 }}
									min={1}
									max={maxLevel + 1}
									step={1}
									marks={true}
									value={sliderValue}
									onChange={(_, value) => {
										setSliderValue(value as number);
									}}
									disabled={Boolean(sliderDisabled)}
								/>
							</Tooltip>
							<LevelTo1Button
								direction="up"
								onClick={() => {
									setSliderValue(sliderValue + 1);
								}}
								disabled={Boolean(
									sliderDisabled ||
										sliderValue >= maxLevel + 1,
								)}
							/>
						</Stack>
						{sliderValue !== currentDisplayLevel && (
							<Stack direction="row" alignItems="center">
								<Typography variant="caption">
									Change level from{' '}
									<b>{currentDisplayLevel}</b> to{' '}
									<b>{sliderValue}</b> ?
								</Typography>
								<Button
									sx={{ ml: 2 }}
									variant="contained"
									color="primary"
									onClick={() => {
										onApplySliderChange(sliderValue);
									}}
								>
									✔ Apply
								</Button>
							</Stack>
						)}
					</Stack>
				</ListItem>
				<ListItem>
					<Tooltip
						{...DefaultTooltipProps}
						title="Complete the learning of the song"
					>
						{!confirmGraduate ? (
							<Button
								variant="outlined"
								component={
									graduateButtonProps?.disabled
										? 'div'
										: 'button'
								}
								onClick={graduateButtonProps?.onClick}
								disabled={graduateButtonProps?.disabled}
							>
								<SchoolTwoTone />
								<DoubleArrowTwoTone />
							</Button>
						) : (
							<Button
								variant="outlined"
								onClick={() => {
									setDialogContent(
										<>
											<Alert severity="warning">
												Your level is{' '}
												<b>NOT maxed out</b> yet.
												<br />
											</Alert>
											Are you sure you want to graduate?
										</>,
									);
									setConfirmGraduateDialogOpen(true);
								}}
							>
								<SchoolTwoTone />
								<DoubleArrowTwoTone />
							</Button>
						)}
					</Tooltip>
				</ListItem>
			</List>
		</PopCard>
	);
}

export interface LevelUpButtonProps {
	song: SchemaDataRow;
	learning: SchemaDataRow;
}

export default function LevelUpButton({
	song,
	learning,
}: LevelUpButtonProps): ReactElement {
	const nextLevelSec = learning
		? getTimeUntilNextLevel(learning as SchemaDataRow)
		: 0;
	const timeDisplay = getTimeUntilNextLevelDisplay(nextLevelSec);
	const expired = nextLevelSec <= 0 || timeDisplay === 'expired';
	const maxLevel = getMaxLevel(learning);
	const queryClient = useQueryClient();
	const { mutate: doLevelTo, isPending: isLevelToPending } = useMutation({
		mutationFn: (targetLevel: number) =>
			levelTo(learning.id as string, targetLevel),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey.some(
						(key) =>
							key === QueryKeys.learning ||
							key === QueryKeys.song,
					),
			});
		},
	});
	const { mutate: doGraduate, isPending: isGraduating } = useMutation({
		mutationFn: () => graduate(learning.id as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey.some(
						(key) =>
							key === QueryKeys.learning ||
							key === QueryKeys.song,
					),
			});
		},
	});
	return (
		<PopButton
			popoverContent={
				<LevelUpCard
					song={song}
					learning={learning as SchemaDataRow}
					confirmGraduate={(learning.level as number) < maxLevel}
					graduateButtonProps={{
						disabled: isLevelToPending || isGraduating,
						onClick: () => {
							doGraduate();
						},
					}}
					onApplySliderChange={(value) => doLevelTo(value - 1)}
					sliderDisabled={isLevelToPending}
				/>
			}
		>
			<Badge
				badgeContent={expired ? '!' : timeDisplay}
				color={expired ? 'warning' : 'primary'}
				sx={{
					p: 0.3,
					'& .MuiBadge-badge': {
						textTransform: 'none',
					},
				}}
			>
				<AccessTimeTwoTone />
			</Badge>

			<Tooltip
				{...DefaultTooltipProps}
				title={
					<>
						You are learning this song at level{' '}
						{(learning?.level as number) + 1}
						<br />
						Click to see more options
					</>
				}
			>
				<Chip
					icon={<MilitaryTech sx={{ fill: 'white' }} />}
					label={(learning?.level as number) + 1}
					sx={{
						ml: 2,
						backgroundColor: 'primary.light',
						color: 'white',
					}}
				/>
			</Tooltip>
		</PopButton>
	);
}

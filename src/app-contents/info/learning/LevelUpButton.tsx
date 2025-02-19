import { DefaultTooltipProps } from '~/app-contents/utils-component';

import {
	PopButton,
	PopCard,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import {
	Avatar,
	Badge,
	Button,
	Chip,
	List,
	ListItem,
	Slider,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	AccessTimeTwoTone,
	ArrowDownward,
	ArrowUpward,
	MilitaryTech,
} from '@mui/icons-material';

import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { levelTo } from './api-calls';
import { QueryKeys } from '../query-keys';

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
				variant="outlined"
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
	nextButtonProps: Omit<LevelTo1ButtonProps, 'direction'>;
	prevButtonProps: Omit<LevelTo1ButtonProps, 'direction'>;
	onChangeSlider: (value: number) => void;
	sliderDisabled?: boolean;
}

export function LevelUpCard({
	song,
	learning,
	nextButtonProps,
	prevButtonProps,
	onChangeSlider,
	sliderDisabled,
}: LevelUpCardProps): ReactElement {
	const [displayLevel, setDisplayLevel] = useState(
		(learning.level as number) + 1,
	);
	useEffect(() => {
		setDisplayLevel((learning.level as number) + 1);
	}, [learning.level]);

	return (
		<PopCard
			header={
				<>
					You are currently learning <b>{song.name}</b> at:
				</>
			}
		>
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
					<Stack
						direction="row"
						sx={{ width: '100%', py: 3 }}
						spacing={1}
						justifyContent="space-between"
						alignItems="center"
					>
						<LevelTo1Button
							direction="down"
							onClick={prevButtonProps.onClick}
							disabled={prevButtonProps.disabled}
						/>
						<Tooltip
							{...DefaultTooltipProps}
							title="Select a level between 1 and 20"
						>
							<Slider
								sx={{ ml: 2, minWidth: 300 }}
								min={1}
								max={getMaxLevel(learning) + 1}
								step={1}
								marks={true}
								value={displayLevel}
								onChange={(_, value) => {
									setDisplayLevel(value as number);
									onChangeSlider(value as number);
								}}
								disabled={sliderDisabled}
							/>
						</Tooltip>
						<LevelTo1Button
							direction="up"
							onClick={nextButtonProps.onClick}
							disabled={nextButtonProps.disabled}
						/>
					</Stack>
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
	const nextLevel = (learning.level as number) + 1;
	const prevLevel = (learning.level as number) - 1;
	const maxLevel = getMaxLevel(learning);
	const queryClient = useQueryClient();
	const { mutate, isPending, isSuccess } = useMutation({
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
	return (
		<PopButton
			popoverProps={{
				open: !isSuccess,
			}}
			popoverContent={
				<LevelUpCard
					song={song}
					learning={learning as SchemaDataRow}
					nextButtonProps={{
						disabled: isPending || nextLevel > maxLevel,
						onClick: () => mutate(nextLevel),
					}}
					prevButtonProps={{
						disabled: isPending || prevLevel < 0,
						onClick: () => mutate(prevLevel),
					}}
					onChangeSlider={(value) => mutate(value - 1)}
					sliderDisabled={isPending}
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

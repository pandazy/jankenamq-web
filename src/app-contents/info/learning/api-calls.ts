import {
	ADDR,
	byIds,
	children,
	CommonHeaders,
	RecordsWithTotal,
	SchemaDataRowParented,
	useSchemaQuery,
} from '~/app-contents/api-calls';
import { QueryKeys } from '~/app-contents/info/query-keys';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import {
	Query,
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryResult,
} from '@tanstack/react-query';

export async function allLearnings({
	orderBy = 'level,created_at desc',
	limit = 10,
	offset = 0,
}: {
	orderBy?: string;
	limit?: number;
	offset?: number;
}): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/all_learning`);
	Object.entries({
		limit,
		offset,
		order_by: orderBy,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function dueLearning(
	limit: number = 10,
	offset: number = 0,
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/due_learning`);
	Object.entries({
		limit,
		offset,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function learningSummary(): Promise<{
	totalSongs: number;
	totalShows: number;
	totalArtists: number;
	totalGraduatedSongs: number;
	totalLearningSongs: number;
	totalDueLearningSongs: number;
}> {
	const url = new URL(`${ADDR}/summary`);
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function totalDueLearning(): Promise<number> {
	const url = new URL(`${ADDR}/total_due_learning`);
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return (await res.json()).total;
}
export async function learnSong(
	songId: string,
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/try_to_learn/${songId}`);
	const res = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function levelTo(
	learningId: string,
	level: number,
): Promise<void> {
	const url = new URL(`${ADDR}/level_to/${learningId}/${level}`);
	const res = await fetch(url, {
		method: 'PATCH',
		headers: CommonHeaders,
	});
	await res.json();
}

// HOOKS BELOW ================================

export function useLearnTheSong(songId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => learnSong(songId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query: Query) =>
					query.queryKey?.includes(QueryKeys.learning) ||
					query.queryKey?.includes(QueryKeys.song),
			});
		},
	});
}

export function useLearningQuery({
	queryFn,
	enabled = true,
	queryKeys = [],
}: {
	queryFn: () => Promise<RecordsWithTotal<SchemaDataRowParented>>;
	enabled?: boolean;
	queryKeys?: string | number[];
}): UseQueryResult<RecordsWithTotal<SchemaDataRowParented>> {
	const learningQueryResults = useSchemaQuery(
		{
			table: 'learning',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.learning, QueryKeys.song, 'all', ...queryKeys],
			queryFn,
			enabled,
		},
	);
	const { data: learningList, isLoading: isLoadingLearning } =
		learningQueryResults;
	const songs =
		learningList?.records.map(
			(learning) => learning.$parents?.song || {},
		) ?? ([] as SchemaDataRow[]);

	const artistIds = songs.map((song) => song.artist_id);
	const artistResults = useQuery({
		queryKey: [QueryKeys.artist, artistIds],
		queryFn: async () => byIds('artist', artistIds as string[]),
		enabled: artistIds.length > 0 && !isLoadingLearning,
	});
	const { data: artistData, isLoading: isArtistLoading } = artistResults;
	if (isLoadingLearning || isArtistLoading || artistIds.length === 0) {
		return {
			...learningQueryResults,
			...artistResults,
			isLoading: isLoadingLearning || isArtistLoading,
		} as unknown as UseQueryResult<RecordsWithTotal<SchemaDataRowParented>>;
	}
	const artistMap = artistData?.records.reduce((acc, artist) => {
		acc[artist.id] = artist;
		return acc;
	}, {} as Record<string, SchemaDataRow>);
	const songArtistMap = songs.reduce((acc, song) => {
		acc[song.id] = artistMap?.[song.artist_id as string] as SchemaDataRow;
		return acc;
	}, {} as Record<string, SchemaDataRow>);

	const parentedLearningList = learningList?.records.map((learning) => {
		const existingSong = learning.$parents?.song as SchemaDataRowParented;
		return {
			...learning,
			$parents: {
				...learning.$parents,
				song: {
					...existingSong,
					$parents: {
						...existingSong.$parents,
						artist: {
							...songArtistMap?.[existingSong.id as string],
						},
					},
				},
			},
		};
	});

	return {
		...learningQueryResults,
		...artistResults,
		data: {
			records: parentedLearningList,
			total: learningList?.total,
		},
	} as unknown as UseQueryResult<RecordsWithTotal<SchemaDataRowParented>>;
}

export function useLearningOfSongsMap(
	songIds: string[],
	enabled: boolean = true,
): UseQueryResult<Record<string, SchemaDataRowParented>> {
	const { data: learningList, ...others } = useQuery({
		queryKey: [QueryKeys.learning, QueryKeys.song, songIds],
		queryFn: () => children('learning', 'song', songIds, 100000000),
		enabled: enabled && songIds.length > 0,
	});
	const learningMap =
		learningList?.records.reduce((acc, learning) => {
			const existing = acc[learning.song_id];
			if (
				!existing ||
				(existing.graduated &&
					(existing.updated_at ?? 0) < (learning.updated_at ?? 0))
			) {
				acc[learning.song_id] = learning;
			}
			return acc;
		}, {} as Record<string, SchemaDataRowParented>) ?? {};
	return {
		...others,
		data: learningMap,
	} as unknown as UseQueryResult<Record<string, SchemaDataRowParented>>;
}

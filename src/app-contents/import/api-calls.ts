import { SchemaDataRow } from '@pandazy/jankenstore-client-web';
import { ADDR, CommonHeaders } from '~/app-contents/api-calls';
import { AmqExportSong, TbdArtist, TbdShow, TbdSong } from './types';

export async function getImportCheck(
	songs: AmqExportSong[],
	dupArtistMap?: Record<string, string>,
): Promise<{
	certainRecords: {
		show: SchemaDataRow;
		artist: SchemaDataRow;
		song: SchemaDataRow;
	}[];
	uncertainRecords: {
		show: TbdShow | SchemaDataRow;
		song: TbdSong | SchemaDataRow;
		artist: TbdArtist | SchemaDataRow;
	}[];
}> {
	const url = new URL(`${ADDR}/import_check`);
	const response = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
		body: JSON.stringify({
			songs,
			...(dupArtistMap ? { dupArtistMap } : {}),
		}),
	});
	return response.json();
}

export async function addPlayHistory(
	inputs: {
		showId: string;
		songId: string;
		videoUrl?: string;
	}[],
): Promise<void> {
	const url = new URL(`${ADDR}/play_history`);
	const response = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
		body: JSON.stringify(inputs),
	});
	return response.json();
}

export async function addArtist(artist: TbdArtist): Promise<SchemaDataRow> {
	const url = new URL(`${ADDR}/store_create`);
	const input = Object.entries(artist).reduce((acc, [key, value]) => {
		if (!key.startsWith('$tbd')) {
			acc[key] = value;
		}
		return acc;
	}, {} as SchemaDataRow);

	const response = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
		body: JSON.stringify({
			Create: ['artist', input],
		}),
	});
	return response.json();
}

export async function addSong(
	song: TbdSong,
	artistId: string,
): Promise<SchemaDataRow> {
	const url = new URL(`${ADDR}/store_create`);
	const input = Object.entries(song).reduce((acc, [key, value]) => {
		if (!key.startsWith('$tbd')) {
			acc[key] = value;
		}
		return acc;
	}, {} as SchemaDataRow);

	const response = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
		body: JSON.stringify({
			Create: ['song', { ...input, artist_id: artistId }],
		}),
	});
	return response.json();
}

export async function addShow(show: TbdShow): Promise<SchemaDataRow> {
	const url = new URL(`${ADDR}/store_create`);
	const input = Object.entries(show).reduce((acc, [key, value]) => {
		if (!key.startsWith('$tbd')) {
			acc[key] = value;
		}
		return acc;
	}, {} as SchemaDataRow);

	const response = await fetch(url, {
		method: 'POST',
		headers: CommonHeaders,
		body: JSON.stringify({
			Create: ['show', input],
		}),
	});
	return response.json();
}

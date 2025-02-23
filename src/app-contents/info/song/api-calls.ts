import { ADDR } from '~/app-contents/api-calls';

export async function getMediaUrlMap(
	songIds: string[],
): Promise<Record<string, string[]>> {
	const songIdString = encodeURIComponent(JSON.stringify(songIds));
	const url = `${ADDR}/media_urls/${songIdString}`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

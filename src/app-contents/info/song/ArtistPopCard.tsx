import { byIds } from '~/app-contents/api-calls';
import { useSchemaQuery } from '~/app-contents/api-calls';
import { ArtistRow } from '~/app-contents/info/Artist';
import { QueryKeys } from '~/app-contents/info/query-keys';

import {
	Piece,
	PopCardList,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import { Alert } from '@mui/material';

export default function ArtistPopCard({
	artistId,
	song,
}: {
	artistId: string;
	song?: SchemaDataRow;
}) {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'artist',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.artist, artistId],
			queryFn: () => byIds('artist', [artistId]),
		},
	);
	const artist = data?.records[0];
	if (!artist) {
		return <Alert severity="error">Artist not found</Alert>;
	}
	return (
		<PopCardList
			header={
				<>
					{song ? (
						<>
							<span>Artist of </span>
							<b>
								<Piece table="song" srcRow={song} col="name" />
							</b>
						</>
					) : (
						<>
							<span>Artist</span>
						</>
					)}
				</>
			}
			data={(data?.records ?? []) as SchemaDataRow[]}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRow) => (
				<ArtistRow
					artist={item}
					{...(song ? { from: ['song', song] } : {})}
				/>
			)}
		/>
	);
}

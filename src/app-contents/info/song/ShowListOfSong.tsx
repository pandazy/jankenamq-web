import { ShowRow } from '~/app-contents/info/Show';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { QueryKeys } from '~/app-contents/info/query-keys';

import {
	Piece,
	SchemaDataRow,
	PopCardList,
} from '@pandazy/jankenstore-client-web';
import { peers } from '~/app-contents/api-calls';

import { useQuery } from '@tanstack/react-query';

export default function ShowListOfSong({
	song,
}: {
	song: SchemaDataRowParented;
}) {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.show, QueryKeys.song, song.id],
		queryFn: () =>
			peers(
				'show',
				{
					song: [song.id as string],
				},
				20,
			),
	});
	return (
		<PopCardList
			header={
				<>
					<span>Shows of </span>
					<b>
						<Piece
							table="song"
							srcRow={song as SchemaDataRow}
							col="name"
						/>
					</b>
				</>
			}
			data={data?.records ?? []}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRowParented) => (
				<ShowRow
					show={item as SchemaDataRow}
					from={['song', song as SchemaDataRow]}
				/>
			)}
		/>
	);
}

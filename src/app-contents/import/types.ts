import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

export interface AmqExportSong {
	songInfo: {
		animeNames: {
			english: string;
			romaji: string;
		};
		animeType: string;
		songName: string;
		artist: string;
		vintage: string;
	};
}

export interface AmqExportSheet {
	songs: AmqExportSong[];
}

export interface TbdSong {
	name: string;
	artist_id?: string;
	$tbd?: boolean;
	$tbd_options?: SchemaDataRow[];
}

export interface TbdArtist {
	name: string;
	$tbd?: boolean;
	$tbd_options?: SchemaDataRow[];
}

export interface TbdShow {
	name: string;
	name_romaji: string;
	vintage: string;
	$tbd?: boolean;
	$tbd_options?: Array<SchemaDataRow>;
}

export type DefiniteItem = {
	show: SchemaDataRow;
	artist: SchemaDataRow;
	song: SchemaDataRow;
	videoUrl?: string;
};

export type UncertainItem = {
	show: TbdShow | SchemaDataRow;
	song: TbdSong | SchemaDataRow;
	artist: TbdArtist | SchemaDataRow;
	videoUrl?: string;
};

export interface ImportCheck {
	straightRecords: DefiniteItem[];
	toBeDecidedRecords: UncertainItem[];
}

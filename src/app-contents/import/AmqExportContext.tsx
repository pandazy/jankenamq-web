import { createContext, useContext, useState } from 'react';
import { AmqExportSheet } from './types';

export type AmqExportContextType = {
	amqExport?: AmqExportSheet;
	updateAmqExport: (amqExport: AmqExportSheet) => void;
	clearAmqExport: () => void;
	setSelectedDuplicateArtistId: (
		name: string,
		selectedDuplicateArtistId?: string,
	) => void;
	getSelectedDuplicateArtistId: (name: string) => string | undefined;
	dupArtistIdMap: Record<string, string>;
};

const AmqExportContext = createContext<AmqExportContextType>({
	updateAmqExport: () => {},
	clearAmqExport: () => {},
	setSelectedDuplicateArtistId: () => {},
	getSelectedDuplicateArtistId: () => undefined,
	dupArtistIdMap: {},
});

export function useAmqExportContext() {
	return useContext(AmqExportContext);
}

const LocalStorageKey = 'amqExport';
const LocalStorageKeySelectedDupArtistIdMap = 'selectedDupArtistIdMap';

export function AmqExportProvider({ children }: { children: React.ReactNode }) {
	const localStorageValue = localStorage.getItem(LocalStorageKey);
	const localStorageValueSelectedDupArtistIdMap = localStorage.getItem(
		LocalStorageKeySelectedDupArtistIdMap,
	);

	const [amqExport, setAmqExport] = useState<AmqExportSheet | undefined>(
		localStorageValue ? JSON.parse(localStorageValue) : undefined,
	);

	const [dupArtistIdMap, setDupArtistIdMap] = useState<
		Record<string, string>
	>(
		localStorageValueSelectedDupArtistIdMap
			? JSON.parse(localStorageValueSelectedDupArtistIdMap)
			: {},
	);

	const setSelectedDuplicateArtistId = (
		name: string,
		selectedDuplicateArtistId?: string,
	) => {
		setDupArtistIdMap((prev) => {
			const newMap = {
				...prev,
				[name]: selectedDuplicateArtistId ?? '',
			};
			localStorage.setItem(
				LocalStorageKeySelectedDupArtistIdMap,
				JSON.stringify(newMap),
			);
			return newMap;
		});
	};

	const updateAmqExport = (amqExport: AmqExportSheet) => {
		setAmqExport(amqExport);
		localStorage.setItem(LocalStorageKey, JSON.stringify(amqExport));
	};

	const getSelectedDuplicateArtistId = (name: string) => {
		return dupArtistIdMap[name];
	};

	const clearAmqExport = () => {
		setAmqExport(undefined);
		setDupArtistIdMap({});
		localStorage.removeItem(LocalStorageKey);
		localStorage.removeItem(LocalStorageKeySelectedDupArtistIdMap);
	};

	return (
		<AmqExportContext.Provider
			value={{
				amqExport,
				clearAmqExport,
				updateAmqExport,
				getSelectedDuplicateArtistId,
				setSelectedDuplicateArtistId,
				dupArtistIdMap,
			}}
		>
			{children}
		</AmqExportContext.Provider>
	);
}

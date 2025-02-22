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

export function AmqExportProvider({ children }: { children: React.ReactNode }) {
	const localStorageKey = 'amqExport';
	const localStorageKeySelectedDupArtistIdMap = 'selectedDupArtistIdMap';

	const localStorageValue = localStorage.getItem(localStorageKey);
	const localStorageValueSelectedDupArtistIdMap = localStorage.getItem(
		localStorageKeySelectedDupArtistIdMap,
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
				localStorageKeySelectedDupArtistIdMap,
				JSON.stringify(newMap),
			);
			return newMap;
		});
	};

	const updateAmqExport = (amqExport: AmqExportSheet) => {
		setAmqExport(amqExport);
		localStorage.setItem(localStorageKey, JSON.stringify(amqExport));
	};

	const getSelectedDuplicateArtistId = (name: string) => {
		return dupArtistIdMap[name];
	};

	const clearAmqExport = () => {
		setAmqExport(undefined);
		localStorage.removeItem(localStorageKey);
		localStorage.removeItem(localStorageKeySelectedDupArtistIdMap);
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

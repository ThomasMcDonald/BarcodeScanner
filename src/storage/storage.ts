import AsyncStorage from '@react-native-async-storage/async-storage';
import { Barcode } from '../types';

async function getAllBarcodes(): Promise<Barcode[]> {
	const keys = await AsyncStorage.getAllKeys();	

	const data = await AsyncStorage.multiGet(keys);
	const barcodes = [];
	console.log('das');

	for(const [, value] of data) {
		barcodes.push(JSON.parse(value));
	}

	return barcodes;
}

async function getBarcodeById(id: string): Promise<Barcode> {
	const data = await AsyncStorage.getItem(id);

	const barcode = JSON.parse(data);

	if(!barcode) {
		throw new Error('Barcode not found');
	}

	return barcode;
}

async function addBarcode(barcode: Barcode): Promise<void> {
	const data = JSON.stringify(barcode);
	await AsyncStorage.setItem(barcode.id, data);
}

async function removeBarcode(id: string): Promise<void> {
	await AsyncStorage.removeItem(id);
}

async function editBarcode(id: string, barcode: Barcode): Promise<void> {
	// this will throw an error if barcode doesnt exist
	await getBarcodeById(id);

	const data = JSON.stringify(barcode);
	await AsyncStorage.setItem(id, data);
}

export {
	addBarcode,
	removeBarcode,
	editBarcode,
	getAllBarcodes,
	getBarcodeById
};

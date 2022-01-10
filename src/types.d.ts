import {  NativeStackScreenProps } from '@react-navigation/native-stack';

type Permission = null | false | true

type Barcode = {
	id: string,
	name: string,
	data: string,
	type: number,
}

type BarcodeModalProps = {
	barcode: Barcode;
	show: boolean;
	closeModal:(barcodeId?: string) => Promise<void>
}

type RootStackParamList = {
	Home: undefined;
	Scanner: undefined;
	Settings: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type BarcodeProps = NativeStackScreenProps<RootStackParamList, 'Scanner'>
type SettingsProps = NativeStackScreenProps<RootStackParamList, 'Settings'>

export type {
	HomeProps,
	BarcodeProps,
	SettingsProps,
	Permission,
	Barcode,
	BarcodeModalProps
};
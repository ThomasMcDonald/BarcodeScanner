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
	closeModal: () => void;
}

type RootStackParamList = {
	Home: undefined;
	Scanner: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type BarcodeProps = NativeStackScreenProps<RootStackParamList, 'Scanner'>

export type {
	HomeProps,
	BarcodeProps,
	Permission,
	Barcode,
	BarcodeModalProps
};
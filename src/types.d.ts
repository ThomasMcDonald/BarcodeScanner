import {  NativeStackScreenProps } from '@react-navigation/native-stack';

type Permission = null | false | true

type Barcode = {
	id: string,
	name: string,
	data: string,
	type: number,
}

type RootStackParamList = {
	Home: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export type {
	Permission,
	Barcode,
	HomeProps
};
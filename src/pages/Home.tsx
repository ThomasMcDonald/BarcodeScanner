import React, { useState, useEffect } from 'react';
import { Entypo  } from '@expo/vector-icons';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Barcode, Permission, HomeProps } from '../types';
import { getAllBarcodes, addBarcode } from '../storage/storage';
import { genId } from '../utils';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	barcodeScanner: {
		flex: 1,
		alignItems: 'center',
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	itemName: {
		fontSize: 20,
	},
});

export default function Home({ navigation }: HomeProps): JSX.Element {
	const [hasPermission, setHasPermission] = useState<Permission>(null);
	const [scanned, setScanned] = useState<boolean>(false);
	const [scanBarcode, setScanBarcode] = useState<boolean>(false);
	const [barcodes, setBarcodes] = useState<Barcode[]>([]);
	const [pageError, setPageError] = useState<Error>();

	const loadInitialData = async () => {
		try {
			const existingBarcodes = await getAllBarcodes();
			setBarcodes(existingBarcodes);
		} catch(error) {
			setPageError(error);
		}
	};

	const getCameraPermission = async() => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setHasPermission(status === 'granted');
	};

	const handleBarcodeScan = ({ type, data }) => {
		setScanned(true);
		setScanBarcode(false);
		
		const newBarcode = {
			id: genId(12),
			name: 'Test',
			data,
			type
		};
		
		addBarcode(newBarcode);
		setBarcodes((b) =>[
			...b,
			newBarcode
		]);
	};
	
	const enableScanner = () => {
		setScanned(false);
		setScanBarcode(true);
	};

	useEffect(() => {
		loadInitialData();
		getCameraPermission();
	}, []);

	useEffect(() => {
		navigation.setOptions({ 
			headerRight: () => (
				<Pressable onPress={enableScanner}>
					<Entypo name="circle-with-plus" size={30} color="black" />
				</Pressable>
			)
		});
	}, [navigation]);

	const renderItem = ({ item }: {item: Barcode}): JSX.Element => {
		const { id, name, data, type } = item;

		return (
			<View key={id} style={styles.item}>
				<Text style={styles.itemName}>{name} - {type}</Text>
				<Text>{data}</Text>
			</View>
		);
	};

	if (hasPermission === null) {
		return (<Text>Getting perms</Text>);
	}

	if (hasPermission === false) {
		return (<Text>No perms</Text>);
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList 
				data={barcodes}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>

			{
				scanBarcode &&
				<BarCodeScanner 
					onBarCodeScanned={scanned ? undefined : handleBarcodeScan}
					style={[StyleSheet.absoluteFill, styles.barcodeScanner]}
					barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
				/>
			}

		</SafeAreaView>
	);
}

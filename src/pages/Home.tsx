import React, { useState, useEffect } from 'react';
import { Entypo  } from '@expo/vector-icons';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Barcode, Permission, HomeProps } from '../types';
import { getAllBarcodes, addBarcode } from '../storage/storage';
import { genId } from '../utils';
import { DEFAULT_NAME } from '../constants';
import QRCode from 'react-native-qrcode-svg';

type BarcodeModalProps = {
	barcode: Barcode;
	show: boolean;
	closeModal: () => void;
}

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
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		fontSize: 25,
		marginBottom: 15,
		textAlign: 'center',
	}
});

export default function Home({ navigation }: HomeProps): JSX.Element {
	const [hasPermission, setHasPermission] = useState<Permission>(null);
	const [scanned, setScanned] = useState<boolean>(false);
	const [scanBarcode, setScanBarcode] = useState<boolean>(false);
	const [barcodes, setBarcodes] = useState<Barcode[]>([]);
	const [pageError, setPageError] = useState<Error>();
	const [currentBarcode, setCurrentBarcode] = useState<Barcode>();
	const [showModal, setShowModal] = useState<boolean>(false);
	
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
			name: DEFAULT_NAME,
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

	const BarcodeModal = ({ barcode, show, closeModal }: BarcodeModalProps): JSX.Element => {

		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={show}
				onRequestClose={closeModal}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{barcode.name}</Text>
						<QRCode
							value={barcode.data}
						/> 
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={() => setShowModal(!showModal)}>
							<Text style={styles.textStyle}>Hide Modal</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		);
	};

	const renderItem = ({ item }: {item: Barcode}): JSX.Element => {
		const { id, name, data } = item;

		const onPress = () => {
			setCurrentBarcode(item);
			setShowModal(true);
		};

		return (
			<Pressable key={id} style={styles.item} onPress={onPress}>
				<Text style={styles.itemName}>{id} - {name}</Text>
				<Text>{data}</Text>
			</Pressable>
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
			{showModal && <BarcodeModal barcode={currentBarcode} show={showModal} closeModal={() => setShowModal(false)}/>	}
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

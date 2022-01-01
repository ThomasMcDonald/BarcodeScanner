import React, { useState, useEffect } from 'react';
import { Entypo  } from '@expo/vector-icons';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { Barcode, Permission, HomeProps } from '../types';
import { getAllBarcodes } from '../storage/storage';
import BarcodeModal from '../components/BarcodeModal';
import QRCode from 'react-native-qrcode-svg';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	barcodeScanner: {
		flex: 1,
		alignItems: 'center',
	},
	item: {
		flexDirection: 'row',
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 10
	},
	itemDetails: {
		flex: 4
	},
	itemName: {
		fontSize: 20,
	},
	itemData: {
		fontSize: 10
	},
	qrCode: {
		flex: 1,
		justifyContent: 'flex-end'		
	}
});

export default function Home({ navigation }: HomeProps): JSX.Element {
	const [hasPermission, setHasPermission] = useState<Permission>(null);
	const [barcodes, setBarcodes] = useState<Barcode[]>([]);
	const [pageError, setPageError] = useState<Error>();
	const [currentBarcode, setCurrentBarcode] = useState<Barcode>();
	const [showModal, setShowModal] = useState<boolean>(false);
	const isFocused = useIsFocused();

	const loadInitialData = async () => {
		try {
			const existingBarcodes = await getAllBarcodes();
			setBarcodes(existingBarcodes);
		} catch(error) {
			setPageError(error);
		}
	};

	const getCameraPermission = async() => {
		const { status } = await Camera.requestCameraPermissionsAsync();
		setHasPermission(status === 'granted');
	};
	
	const enableScanner = () => {
		navigation.navigate('Scanner');
	};
	
	useEffect(() => {
		loadInitialData();
	}, [isFocused]);

	useEffect(() => {
		getCameraPermission();
	}, []);

	useEffect(() => {
		navigation.setOptions({ 
			headerShown: true,
			headerRight: () => (
				<Pressable onPress={enableScanner}>
					<Entypo name="circle-with-plus" size={30} color="black" />
				</Pressable>
			)
		});
	}, [navigation]);

	const renderItem = ({ item }: {item: Barcode}): JSX.Element => {
		const { id, name, data } = item;

		const onPress = () => {
			setCurrentBarcode(item);
			setShowModal(true);
		};

		return (
			<Pressable key={id} style={styles.item} onPress={onPress}>
				<View style={styles.itemDetails}>
					<Text style={styles.itemName}>{name}</Text>
				</View>
				<View style={styles.qrCode}>
					<QRCode
						value={data}
						size={50}
					/> 
				</View>
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
		
		</SafeAreaView>
	);
}

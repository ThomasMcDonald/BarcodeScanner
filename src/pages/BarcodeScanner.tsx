import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Pressable, Dimensions, Platform, StatusBar  } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner as ExpoBarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign  } from '@expo/vector-icons';
import { DEFAULT_NAME } from '../constants';
import { BarcodeProps, Barcode } from '../types';
import { genId } from '../utils';
import { addBarcode } from '../storage/storage';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	information: { 
		flex: 1,
		backgroundColor: 'black'
	},
	informationTextContainer: {
		flexDirection: 'row',
		backgroundColor: 'red',
		textAlign:'center',
		alignContent: 'center'
	},
	informationText: {
		color: 'white',
	},
	camera: {
		flex: 1,
	},
	topButtonContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingTop: StatusBar.currentHeight,
		marginRight: 10,
		marginBottom: 10
	},
	bottomButtonContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		margin: 10
	},
	button: {
		flex: 0.1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	text: {
		fontSize: 18,
		color: 'white',
	},
});

export default function BarcodeScanner({ navigation }: BarcodeProps): JSX.Element {
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const camera = useRef(null);
	const [ratio, setRatio] = useState('16:9'); 
	const { height, width } = Dimensions.get('window');
	const screenRatio = height / width;
	const [isRatioSet, setIsRatioSet] =  useState(false);
	const isFocused = useIsFocused();

	/**
	 * Got this from stackoverflow
	 * https://stackoverflow.com/a/63282346
	 * minus the top and bottom padding, that looked no good
	 */
	// set the camera ratio and padding.
	// this code assumes a portrait mode screen
	const prepareRatio = async () => {
		let desiredRatio = '4:3';  // Start with the system default

		// This issue only affects Android
		if (Platform.OS === 'android') {
			const ratios = await camera.current.getSupportedRatiosAsync();

			// Calculate the width/height of each of the supported camera ratios
			// These width/height are measured in landscape mode
			// find the ratio that is closest to the screen ratio without going over
			const distances = {};
			const realRatios = {};
			let minDistance = null;

			for (const ratio of ratios) {
				const parts = ratio.split(':');
				const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
				realRatios[ratio] = realRatio;
				// ratio can't be taller than screen, so we don't want an abs()
				const distance = screenRatio - realRatio; 
				distances[ratio] = realRatio;

				if (minDistance == null) {
					minDistance = ratio;
				} else {
					if (distance >= 0 && distance < distances[minDistance]) {
						minDistance = ratio;
					}
				}
			}

			// set the best match
			desiredRatio = minDistance;

			// set the preview padding and preview ratio
			setRatio(desiredRatio);
			// Set a flag so we don't do this 
			// calculation each time the screen refreshes
			setIsRatioSet(true);
		}
	};
  
	const handleBarcodeScan = ({ type, data }) => {
		
		const newBarcode:Barcode = {
			id: genId(12),
			name: DEFAULT_NAME,
			data,
			type
		};
		
		addBarcode(newBarcode);
		navigation.navigate('Home');

	};

	const setCameraReady = async() => {
		if (!isRatioSet) {
			await prepareRatio();
		}
	};

	const closeCamera = () => {
		navigation.pop();
	};

	const flipCamera = () => {
		setCameraType(
			cameraType === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);
	};

	useEffect(() => {
		async function getCameraStatus() {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(status === 'granted');
		}

		getCameraStatus();
	}, []);

	function CameraClose():JSX.Element {
		return (
			<View style={styles.topButtonContainer}>
				<Pressable
					style={styles.button}
					onPress={closeCamera}
				>
					<AntDesign name='close' size={24} color='white' />
				</Pressable>
			</View>
		);
	}

	function InformationBooth({ information }: { information: string }): JSX.Element {
		return (
			<SafeAreaView style={styles.information}>
				<CameraClose />
				<View style={styles.informationTextContainer}>
					<Text style={styles.informationText}>{information}</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (hasCameraPermission === null) {
		return (
			<InformationBooth information={'Waiting For Camera Permissions'} />
		);
	} else if (hasCameraPermission === false) {
		return (
			<InformationBooth information={'Please enable camera permissions'} />
		);
	} else if (isFocused) {
		return (	
			<Camera 
				style={styles.camera}
				type={cameraType}
				ratio={ratio}
				onCameraReady={setCameraReady}
				ref={camera}
				onBarCodeScanned={handleBarcodeScan}
				barCodeScannerSettings={{
					barCodeTypes: [ExpoBarCodeScanner.Constants.BarCodeType.qr],
				}}
			>	

				<View  style={styles.topButtonContainer}>
					<CameraClose />

					<View style={styles.bottomButtonContainer}>
						{	
							Object.keys(Camera.Constants.Type).length &&
								<Pressable
									style={styles.button}
									onPress={flipCamera}>
									<AntDesign name='swap' size={24} color='white' />
								</Pressable>
						}
					</View>
				</View>
			</Camera>
		);
	}  else {
		return (
			<InformationBooth information={'Somethings Broken'} />
		); 
	}
}
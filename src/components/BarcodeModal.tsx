import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { AntDesign  } from '@expo/vector-icons';

import { View, Text, Pressable, Modal, StyleSheet, TextInput } from 'react-native';
import { Barcode, BarcodeModalProps } from '../types';
import { editBarcode, removeBarcode } from '../storage/storage';

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: 'white',
		borderRadius: 20,
		width: '80%',
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
		marginTop: 25,
		borderRadius: 10,
		padding: 10,
		elevation: 2,
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
	},
	barcodeNameInput: {
		fontSize: 25,
		width:  '4%'
	},
	saveButton: {
		fontSize: 25
	}
});

export default function BarcodeModal({ barcode, show, closeModal }: BarcodeModalProps): JSX.Element {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [barcodeName, setBarcodeName] = useState<string>(barcode.name);
	const nameInput = useRef(null);

	const onDeleteBarcode = () => {
		removeBarcode(barcode.id);
		closeModal();
	};

	const onEditBarcode = () => {
		setIsEditing(true);
	};
	
	const updateBarcode = () => {
		const newBarcodeValues: Partial<Barcode> = {
			name: barcodeName
		};

		editBarcode(barcode.id, newBarcodeValues);
		setIsEditing(false);
	};

	const onModalClose = () => {
		closeModal(barcode.id);
	};

	useEffect(() => {
		if(isEditing && nameInput.current) {
			nameInput.current.focus();
		}
	}, [isEditing]);

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			onRequestClose={onModalClose}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{
						isEditing ?
							(
								<View>
									<TextInput style={styles.barcodeNameInput} onChangeText={setBarcodeName} placeholder={barcode.name} value={barcodeName} ref={nameInput}/>
									<Pressable onPress={updateBarcode}>
										<Text style={styles.saveButton}>Save</Text>
									</Pressable>
								</View>
							) :
							(	
								<View>
									<Text style={styles.modalText}>{barcodeName}</Text>
									<Pressable onPress={onEditBarcode}>
										<AntDesign name="edit" size={60}/>
									</Pressable>
								</View>
							)
					}
					
					<QRCode
						value={barcode.data}
						size={150}
					/> 
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={onModalClose}>
						<Text style={styles.textStyle}>Hide Modal</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={onDeleteBarcode}>
						<Text style={styles.textStyle}>Delete</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
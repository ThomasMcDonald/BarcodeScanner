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
	modalContent: {
		paddingLeft: 35,
		paddingRight: 35,
		paddingBottom: 35,
		alignItems: 'center',
	},
	modalTopButtonContainer: {
		padding: 10,
		width: '100%',
		alignItems: 'flex-end'
	},
	modalBottomButtonContainer: {
		padding: 10,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
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
	buttonDelete: {
		backgroundColor: 'red',
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
		closeModal(barcode.id);
	};

	const onEditBarcode = () => {
		setIsEditing(true);
	};

	const onCancelEdit = () => {
		setIsEditing(false);
		setBarcodeName(barcode.name);
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
			onRequestClose={onModalClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.modalTopButtonContainer}>
						<Pressable
							onPress={onModalClose}>
							<AntDesign name="close" size={24} color="black" />
						</Pressable>
					</View>
					<View style={styles.modalContent}>
						{
							isEditing ?
								(
									<TextInput style={styles.barcodeNameInput} onChangeText={setBarcodeName} placeholder={barcode.name} value={barcodeName} ref={nameInput}/>
								) :
								(	
									<Text style={styles.modalText}>{barcodeName}</Text>			
								)
						}
					
						<QRCode
							value={barcode.data}
							size={150}
						/> 
					</View>
					{
						isEditing ?
							(	
								<View style={styles.modalBottomButtonContainer}>
									<Pressable 
										style={[styles.button, styles.buttonClose]}
										onPress={onCancelEdit}
									>
										<Text style={styles.textStyle}>Cancel</Text>
									</Pressable>
									<Pressable 
										style={[styles.button, styles.buttonClose]}
										onPress={updateBarcode}
									>
										<Text style={styles.textStyle}>Save</Text>
									</Pressable>	
								</View>
							) :
							(	
								<View style={styles.modalBottomButtonContainer}>
									<Pressable
										style={[styles.button, styles.buttonDelete]}
										onPress={onDeleteBarcode}
									>
										<Text style={styles.textStyle}>Delete</Text>
									</Pressable>
									<Pressable 
										style={[styles.button, styles.buttonClose]}
										onPress={onEditBarcode}
									>
										<Text style={styles.textStyle}>Edit</Text>
									</Pressable>	
								</View>			
							)
					}
				</View>
			</View>
		</Modal>
	);
}
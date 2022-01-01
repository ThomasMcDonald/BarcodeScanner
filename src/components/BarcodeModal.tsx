import React from 'react';
import QRCode from 'react-native-qrcode-svg';

import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { BarcodeModalProps } from '../types';

const styles = StyleSheet.create({
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
	}
});

export default function BarcodeModal({ barcode, show, closeModal }: BarcodeModalProps): JSX.Element {

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
						size={150}
					/> 
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={closeModal}>
						<Text style={styles.textStyle}>Hide Modal</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
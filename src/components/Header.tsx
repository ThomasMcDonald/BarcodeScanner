import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Entypo  } from '@expo/vector-icons';

type Header = {
	back?: any;
	navigation: any;
	options: any;
	title?: string;
	headerRight?: () => JSX.Element
	headerLeft?: () => JSX.Element
}

const styles = StyleSheet.create({
	header: {
		width: '100%',
	},
	content: {
		display: 'flex',
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'space-between',
		marginTop:50,
	},
	brandText: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	buttonContainers: {
		justifyContent: 'center',
	},
	backButtonText: {
		fontSize: 20,
	}
});

export default function Header(props: Header): JSX.Element {
	const { back, navigation, options } = props;
	
	const { title = "Barcode Scanner", headerRight } = options;

	return (
		<View style={styles.header}>	
			<View style={styles.content}>
				<View style={styles.buttonContainers}>
					{
						back && 	
						<Pressable onPress={navigation.goBack}>
							<Entypo style={styles.backButtonText}  name="arrow-left" color="black" />
						</Pressable>
					}
				</View>
				<View >
					<Text style={styles.brandText}>{title}</Text>
				</View>
				<View style={styles.buttonContainers}>
					{
						headerRight && headerRight()
					}
				</View>
			</View>
			
		</View>
	);
}

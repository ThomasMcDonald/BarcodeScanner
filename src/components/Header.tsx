import React from 'react';
import { Pressable, StyleSheet, SafeAreaView,View, Text, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
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
		paddingTop: StatusBar.currentHeight + 20
	},
	brandContainer: {
		flex: 5,
	},
	brandText: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	buttonContainers: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
	backButtonText: {
		fontSize: 20,
	}
});

export default function Header(props: Header): JSX.Element {
	const { options } = props;
	
	const { title = 'QR Scanner', headerRight, headerLeft } = options;

	return (
		<SafeAreaView style={styles.header}>
			<ExpoStatusBar style='auto'/>	
			<View style={styles.content}>
				<View style={styles.buttonContainers}>
					{
						headerLeft && headerLeft()
					}
				</View>
				<View style={styles.brandContainer}>
					<Text style={styles.brandText}>{title}</Text>
				</View>
				<View style={styles.buttonContainers}>
					{
						headerRight && headerRight()
					}
				</View>
			</View>	
		</SafeAreaView>
	);
}

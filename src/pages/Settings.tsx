import React, { useEffect } from 'react';
import { AntDesign  } from '@expo/vector-icons';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Pressable, ToastAndroid, Linking, Alert  } from 'react-native';
import config from '../../app.json';
import { SettingsProps } from '../types';
import { GITHUB_URL } from '../constants';
import { clearAppData } from '../storage/storage';

type SettingsListProps = {	
	key: string;
	icon: any; 
	action?: () => void;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end'
	},
	headerAction: {
		textAlign: 'center'
	},
	aboutApp: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
	listItem: {  
		alignItems: 'center', 
		flexDirection: 'row', 
		backgroundColor: 'lightgrey', 
		padding: 10, 
		margin: 20 
	},
	itemText: { 
		fontSize: 20, 
		padding: 10 
	}
});

const ListItem = ({ item }: {item: SettingsListProps}) => (
	<Pressable key={item.key} onPress={item.action} style={styles.listItem}>
		<AntDesign name={item.icon} size={20}  color='black' style={styles.headerAction}/> 
		<Text style={styles.itemText}>{item.key}</Text>
	</Pressable>
);

export default function Settings({ navigation }: SettingsProps): JSX.Element {

	const goBack = () => {
		navigation.pop();
	};

	const gotToLink = (link: string) => () => {
		Linking.canOpenURL(link).then(supported => {
			if (supported) {
				ToastAndroid.show(`Opening ${link}`, ToastAndroid.SHORT);
				Linking.openURL(link);
			} else {
				ToastAndroid.show(`Cannot open ${link}`, ToastAndroid.SHORT);
			}
		});

	};

	const confirmDelete = () => {
		Alert.alert(
			'Clear All Data?',
			'This will wipe all scanned data and cannot be undone',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{ 
					text: 'Confirm', 
					onPress: clearAppData 
				}
			]
		);
	};

	const links = [
		{
			key: 'View Source',
			icon: 'github',
			action: gotToLink(GITHUB_URL) 
		},
		{
			key: 'Clear All Data',
			icon: 'delete',
			action: confirmDelete
		}
	];

	useEffect(() => {
		navigation.setOptions({ 
			headerShown: true,
			title: 'Settings',
			headerLeft: () => (
				<Pressable onPress={goBack}>
					<AntDesign name='arrowleft' size={25}  color='black' style={styles.headerAction}/>
				</Pressable>
			)
		});
	}, [navigation]);

	return (
		<SafeAreaView style={styles.container}>	
			<FlatList
				data={links} 
				renderItem={ListItem}
			/>
			<View style={styles.aboutApp}>
				<Text> Version: {config.expo.version}:{config.expo.android.versionCode} </Text>
			</View>
		</SafeAreaView>
	);
}

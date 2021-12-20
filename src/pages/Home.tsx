import React, {useState, useEffect} from 'react';
import { Entypo  } from '@expo/vector-icons';

import { SafeAreaView, FlatList, StyleSheet, Text, View, Pressable} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

type Permission = null | false | true

type Barcode = {
  id: string,
  name: string,
  data: string,
  type: number,
}

const BARCODE_DATA: Barcode[] = [
  {
    id: '1',
    name: 'Test',
    data: 'https://github.com/ThomasMcDonald/BarcodeScanner',
	type: 256
  }
];

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

export default function Home({navigation}): JSX.Element {
	const [hasPermission, setHasPermission] = useState<Permission>(null);
	const [scanned, setScanned] = useState<boolean>(false);
	const [scanBarcode, setScanBarcode] = useState<boolean>(false);

	const getCameraPermission = async() => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setHasPermission(status === 'granted');
	}

	const handleBarcodeScan = ({type, data, ...rest}) => {
		setScanned(true);
		setScanBarcode(false);


		BARCODE_DATA.push({
			id: BARCODE_DATA[BARCODE_DATA.length - 1].id + 1,
			name: 'TEst',
			data,
			type
		})
	}

	useEffect(() => {
		getCameraPermission();
	}, []);

	const enableScanner = () => {
		setScanned(false);
		setScanBarcode(true);
	}

	useEffect(() => {
		navigation.setOptions({ 
			headerRight: () => (
				<Pressable onPress={enableScanner}>
					<Entypo name="circle-with-plus" size={24} color="black" />
				</Pressable>
			)
		});
	}, [navigation]);

  const renderItem = ({item}: any): JSX.Element => {
    const {id, name, data, type} = item

    return (
      <View key={id} style={styles.item}>
        <Text style={styles.itemName}>{name} - {type}</Text>
        <Text>{data}</Text>
      </View>
    )
  }
  
  if (hasPermission === null) {
	  return (<Text>Getting perms</Text>)
  }

  if (hasPermission === false) {
	  return (<Text>No perms</Text>)
  }
 
  return (
    <SafeAreaView style={styles.container}>
	
		<FlatList 
			data={BARCODE_DATA}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
		/>

		{
			scanBarcode &&
			<BarCodeScanner 
				onBarCodeScanned={scanned ? undefined : handleBarcodeScan}
				style={[StyleSheet.absoluteFill, styles.barcodeScanner]}
			/>
		}
	
    </SafeAreaView>
  );
}

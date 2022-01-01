import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/pages/Home';
import Header from './src/components/Header';
import BarcodeScanner from './src/pages/BarcodeScanner';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen 
					name="Home" 
					component={Home}
					options= {{
						header: (props) => <Header {...props} back={false}/>
					}}
				/>
				<Stack.Screen 
					name="Scanner" 
					component={BarcodeScanner}
					options= {{
						headerShown: false
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
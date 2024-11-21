import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../components/pages/Login';
import { Home } from '../components/pages/Home';
import MainTab from './MainTab';
import { DonationReceivedList } from '../components/pages/DonationReceived/List';
import { DonationDeliveredList } from '../components/pages/DonationDelivered/List';
import { DonationReceivedCreate } from '../components/pages/DonationReceived/Create';
import { DonationDeliveredCreate } from '../components/pages/DonationDelivered/Create';
import { DoneesList } from '../components/pages/Donees/List';
import { DoneesCreate } from '../components/pages/Donees/Create';
import { DonorsList } from '../components/pages/Donors/List';
import { DonorsCreate } from '../components/pages/Donors/Create';
import { FamilyList } from '../components/pages/Family/List';
import { FamilyCreate } from '../components/pages/Family/Create';
import { ItemsList } from '../components/pages/Items/List';
import { ItemsCreate } from '../components/pages/Items/Create';
import { UserList } from '../components/pages/User/List';
import { UserCreate } from '../components/pages/User/Create';

const Stack = createStackNavigator();

export default () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            <Stack.Screen name="DonationReceivedList" component={DonationReceivedList} options={{headerShown: false}}/>
            <Stack.Screen name="DonationReceivedCreate" component={DonationReceivedCreate} options={{headerShown: false}}/>

            <Stack.Screen name="DonationDeliveredList" component={DonationDeliveredList} options={{headerShown: false}}/>
            <Stack.Screen name="DonationDeliveredCreate" component={DonationDeliveredCreate} options={{headerShown: false}}/>

            <Stack.Screen name="DoneesList" component={DoneesList} options={{headerShown: false}}/>
            <Stack.Screen name="DoneesCreate" component={DoneesCreate} options={{headerShown: false}}/>

            <Stack.Screen name="DonorsList" component={DonorsList} options={{headerShown: false}}/>
            <Stack.Screen name="DonorsCreate" component={DonorsCreate} options={{headerShown: false}}/>

            <Stack.Screen name="FamilyList" component={FamilyList} options={{headerShown: false}}/>
            <Stack.Screen name="FamilyCreate" component={FamilyCreate} options={{headerShown: false}}/>

            <Stack.Screen name="ItemsList" component={ItemsList} options={{headerShown: false}}/>
            <Stack.Screen name="ItemsCreate" component={ItemsCreate} options={{headerShown: false}}/>

            <Stack.Screen name="UserList" component={UserList} options={{headerShown: false}}/>
            <Stack.Screen name="UserCreate" component={UserCreate} options={{headerShown: false}}/>

            <Stack.Screen name="MainTab" component={MainTab} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}
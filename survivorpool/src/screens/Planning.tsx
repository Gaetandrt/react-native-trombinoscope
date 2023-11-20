import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import FondPlanning from '../../assets/Planning_page.png';

const Planning: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground resizeMode='cover' style={{ flex: 1 }} source={FondPlanning} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
});

export default Planning;

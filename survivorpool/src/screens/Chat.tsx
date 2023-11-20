import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

function DiscordLoginPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://discord.com/login' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // scalesPageToFit={false} // Désactiver le zoom
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
  },
});

function KeyBoardview() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DiscordLoginPage />
    </SafeAreaView>
  );
}

export default KeyBoardview;

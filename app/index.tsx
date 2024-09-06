import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import useOpenAISpeech from '@/hooks/useOpenAISpeech';
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [input, setInput] = useState<string>('');
  const { generateSpeech, loading, error } = useOpenAISpeech();

  const handleGenerateSpeech = async () => {
    if (input) {
      await generateSpeech(input);
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Text className="text-xl font-bold mb-4 text-gray-700">
          Enter Text:
        </Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type something..."
          className="w-full p-3 border border-gray-300 rounded mb-4 text-lg"
        />
        <Button
          title="Generate Speech"
          onPress={handleGenerateSpeech}
          color="#4f46e5"
        />

        {loading && (
          <ActivityIndicator size="large" color="#4f46e5" className="mt-4" />
        )}
        {error && <Text className="text-red-500 mt-4">{error}</Text>}
      </View>
    </ThemeProvider>
  );
}

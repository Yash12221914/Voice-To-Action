import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";


export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState("Press 'Start Recording' and speak...");

  // 🎤 Start Recording
  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access the microphone is required!");
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // 🛑 Stop Recording
  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        setTranscription("Processing...");
        await transcribeAudio(uri);
      } else {
        console.error("Recording URI is null");
        setTranscription("Recording failed, please try again.");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  // 🎙 Transcribe Audio
  const transcribeAudio = async (uri: string) => {
    try {
      // Convert audio to base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.mp3", // Ensure correct format
        type: "audio/mp3",
      } as any);

      formData.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": Bearer YOUR_OPENAI_API_KEY, // Store this securely
        },
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        console.error("OpenAI API Error:", data.error);
        setTranscription(Error: ${data.error.message});
      } else {
        setTranscription(data.text || "No transcription available.");
      }
    } catch (error) {
      console.error("You are not audible:", error);
      setTranscription("You are not audible.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Voice Assistant</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.transcriptionContainer}>
        <Text style={styles.transcription}>{transcription}</Text>
      </ScrollView>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1E1E1E", // Fallback dark theme background
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 1,
  },
  transcriptionContainer: {
    width: "90%",
    maxHeight: 250,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Glassmorphism effect
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    backdropFilter: "blur(10px)", // For Web Glassmorphism effect
  },
  transcription: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 24,
  },
});



// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";

// export default function HomeScreen() {
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const [transcription, setTranscription] = useState("Press 'Start Recording' and speak...");

//   const startRecording = async () => {
//     try {
//       const { granted } = await Audio.requestPermissionsAsync();
//       if (!granted) {
//         alert("Permission to access microphone is required!");
//         return;
//       }

//       const recording = new Audio.Recording();
//       await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       await recording.startAsync();
//       setRecording(recording);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       if (!recording) return;
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecording(null);

//       if (uri) {
//         setTranscription("Processing...");
//         await transcribeAudio(uri);
//       }
//     } catch (error) {
//       console.error("Error stopping recording:", error);
//     }
//   };

//   const transcribeAudio = async (uri: string) => {
//     try {
//       const fileInfo = await FileSystem.getInfoAsync(uri);
//       if (!fileInfo.exists) {
//         setTranscription("Audio file not found.");
//         return;
//       }
  
//       let formData = new FormData();
//       formData.append("file", {
//         uri,
//         name: "audio.wav",
//         type: "audio/wav",
//       } as any);
  
//       formData.append("model", "whisper-1"); // Required for OpenAI API
  
//       const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
//         method: "POST",
//         headers: {
//           Authorization: `api key`,
//         },
//         body: formData,
//       });
  
//       const data = await response.json();
      
//       if (data.error) {
//         console.error("OpenAI API Error:", data.error);
//         setTranscription(`Error: ${data.error.message}`);
//       } else {
//         setTranscription(data.text || "No transcription available.");
//       }
//     } catch (error) {
//       console.error("Error transcribing audio:", error);
//       setTranscription("Error transcribing audio.");
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Smart Voice Assistant</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={recording ? stopRecording : startRecording}
//       >
//         <Text style={styles.buttonText}>
//           {recording ? "Stop Recording" : "Start Recording"}
//         </Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.transcriptionContainer}>
//         <Text style={styles.transcription}>{transcription}</Text>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   transcriptionContainer: {
//     width: "100%",
//     maxHeight: 200,
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   transcription: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//   },
// });

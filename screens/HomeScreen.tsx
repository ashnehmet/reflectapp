import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { useUser } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const apiKey = "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";

async function transcribeAudio(uri: string, apiKey: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "rec.m4a",
      type: "audio/m4a",
    } as any);
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const data = await response.json();
    console.log("Transcription result:", data);
    return data.text || "";
  } catch (e) {
    console.error("Transcription error:", e);
    return "";
  }
}


async function fetchSummaryAndTasks(transcript: string, apiKey: string): Promise<{ summary: string; tasks: string[]; reflection: string }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant that summarizes speech and extracts To Do items and tone reflections. Ignore meta-instructions like 'tag to do'. Only return real tasks.",
        },
        {
          role: "user",
          content: `Transcript: ${transcript}\n\n1. Provide a short summary.\n2. List any To Do items in array format.\n3. Provide tone and communication reflection.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  console.log("Summary Response:", text);

  const summaryMatch = text.match(/Summary:\s*(.*?)\n/i);
  const summary = summaryMatch?.[1]?.trim() ?? "";

  const todoMatch = text.match(/To Do items:\s*\n?((?:- .*?\n)+)/i);
  const tasks = todoMatch ? todoMatch[1].split("\n").filter(Boolean).map((line) => line.replace(/^[-•]\s*/, "")) : [];

  const reflectionMatch = text.match(/Reflection:\s*(.*)/i);
  const reflection = reflectionMatch?.[1]?.trim() ?? "";

  return { summary, tasks, reflection };
}

export default function HomeScreen() {
  const { isProUser } = useUser();
  const [summary, setSummary] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

	useEffect(() => {
		loadTasks();
	}, []);

	const loadTasks = async () => {
	const json = await AsyncStorage.getItem("tasks");
	if (json) setTasks(JSON.parse(json));
	};

	const saveTasks = async (items: string[]) => {
  setTasks(items);
  await AsyncStorage.setItem("tasks", JSON.stringify(items));
};

  const [reflection, setReflection] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      console.error("startRecording error:", e);
    }
  };

  const stopRecording = async () => {
  setIsRecording(false);
  const rec = recordingRef.current;
  if (!rec) return;

  try {
    await rec.stopAndUnloadAsync();
    const uri = rec.getURI()!;
    console.log("Recording saved at:", uri);

    let transcript = await transcribeAudio(uri, apiKey);
    console.log("Transcript:", transcript);

    // Remove meta-commands like "tag to do"
    transcript = transcript.replace(/tag\s+to\s+do[:]?/i, "").trim();

    const data = await fetchSummaryAndTasks(transcript, apiKey);
    console.log("Summary & Reflection:", data);

    setSummary(data.summary);
    setTasks(data.tasks);
    setReflection(data.reflection);
  } catch (e) {
    console.error("stopRecording error:", e);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reflecta</Text>

      <TouchableOpacity
        style={isRecording ? styles.stopButton : styles.button}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
        </Text>
      </TouchableOpacity>

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <ActivityIndicator size="small" color="red" />
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}

      <Text style={styles.subtitle}>Summary:</Text>
      <Text style={styles.text}>{summary || "—"}</Text>

      <Text style={styles.subtitle}>To Do:</Text>
      {tasks.length > 0 ? (
  tasks.map((task, index) => (
    <Text key={index} style={styles.task}>
      • {typeof task === 'string' ? task : task.text}
    </Text>
  ))
) : (
  <Text style={styles.text}>No tasks</Text>
)}

      <Text style={styles.subtitle}>Tone Reflection:</Text>
      {isProUser ? (
        <Text style={styles.text}>{reflection || "—"}</Text>
      ) : (
        <View style={styles.lockedCard}>
          <Text style={styles.lockedText}>Upgrade to Pro to see communication insights</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f1f5f9",
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: Dimensions.get("window").width - 40,
    alignSelf: "center",
  },
  stopButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: Dimensions.get("window").width - 40,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center"
  },
  recordingIndicator: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  recordingText: {
    color: "red",
    marginLeft: 8,
  },
  subtitle: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b"
  },
  text: {
    fontSize: 17,
    color: "#475569",
    lineHeight: 24,
    marginTop: 4
  },
  task: {
    fontSize: 17,
    marginLeft: 16,
    color: "#0f172a",
    marginBottom: 6
  },
  lockedCard: {
    backgroundColor: "#e2e8f0",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  lockedText: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
});

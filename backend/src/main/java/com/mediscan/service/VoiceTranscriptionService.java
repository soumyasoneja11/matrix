package com.mediscan.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VoiceTranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(VoiceTranscriptionService.class);

    private static final String GEMINI_GENERATE_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";

    private static final String TRANSCRIBE_PROMPT =
            "Listen to this audio and transcribe it verbatim. "
                    + "Preserve the speaker language: Hindi, English, or mixed Hindi-English (Hinglish). "
                    + "Do not translate. Output only the transcribed words, no preamble.";

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.gemini.key:}")
    private String geminiKey;

    @Value("${ai.gemini.voice.model:gemini-1.5-flash}")
    private String geminiVoiceModel;

    @Value("${ai.huggingface.key:}")
    private String huggingFaceKey;

    @Value("${ai.huggingface.whisper.url:https://api-inference.huggingface.co/models/openai/whisper-large-v3}")
    private String whisperUrl;

    public VoiceTranscriptionService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String transcribe(byte[] audioBytes, String mimeType) {
        if (audioBytes == null || audioBytes.length == 0) {
            throw new IllegalArgumentException("Audio is empty");
        }
        String normMime = normalizeMime(mimeType);

        if (geminiKey != null && !geminiKey.isBlank()) {
            try {
                String t = transcribeWithGemini(audioBytes, normMime);
                if (t != null && !t.isBlank()) {
                    return t.trim();
                }
            } catch (Exception e) {
                log.warn("Gemini transcription failed, trying Hugging Face: {}", e.getMessage());
            }
        }

        if (huggingFaceKey != null && !huggingFaceKey.isBlank()) {
            try {
                String t = transcribeWithHuggingFace(audioBytes, normMime);
                if (t != null && !t.isBlank()) {
                    return t.trim();
                }
            } catch (Exception e) {
                log.error("Hugging Face transcription failed: {}", e.getMessage());
            }
        }

        throw new IllegalStateException(
                "Voice transcription failed. Set GEMINI_API_KEY and/or HUGGINGFACE_API_KEY.");
    }

    private String transcribeWithGemini(byte[] audioBytes, String mimeType) throws Exception {
        String url = String.format(GEMINI_GENERATE_TEMPLATE, geminiVoiceModel);

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", mimeType);
        inlineData.put("data", Base64.getEncoder().encodeToString(audioBytes));

        Map<String, Object> audioPart = new HashMap<>();
        audioPart.put("inline_data", inlineData);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", TRANSCRIBE_PROMPT);

        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(textPart);
        parts.add(audioPart);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", parts);

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String fullUrl = url + "?key=" + java.net.URLEncoder.encode(geminiKey, StandardCharsets.UTF_8);

        String response = restTemplate.postForObject(fullUrl, entity, String.class);
        return extractGeminiText(response);
    }

    private String extractGeminiText(String json) throws Exception {
        if (json == null || json.isBlank()) {
            return "";
        }
        JsonNode root = objectMapper.readTree(json);
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            return "";
        }
        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (!parts.isArray()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (JsonNode p : parts) {
            if (p.has("text")) {
                sb.append(p.get("text").asText());
            }
        }
        return sb.toString();
    }

    private String transcribeWithHuggingFace(byte[] audioBytes, String mimeType) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(mimeType));
        headers.setBearerAuth(huggingFaceKey);

        HttpEntity<byte[]> entity = new HttpEntity<>(audioBytes, headers);
        String response = restTemplate.postForObject(whisperUrl, entity, String.class);
        return extractHfText(response);
    }

    private String extractHfText(String json) throws Exception {
        if (json == null || json.isBlank()) {
            return "";
        }
        JsonNode root = objectMapper.readTree(json);
        if (root.has("text")) {
            return root.get("text").asText("");
        }
        if (root.isArray() && root.size() > 0 && root.get(0).has("text")) {
            return root.get(0).get("text").asText("");
        }
        return "";
    }

    private static String normalizeMime(String mimeType) {
        if (mimeType == null || mimeType.isBlank()) {
            return "audio/webm";
        }
        String t = mimeType.trim();
        int semi = t.indexOf(';');
        if (semi >= 0) {
            t = t.substring(0, semi).trim();
        }
        return t.isEmpty() ? "audio/webm" : t;
    }
}
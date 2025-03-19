package com.edtech.edtch.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import java.io.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketStreamHandler extends BinaryWebSocketHandler {
    private final ConcurrentHashMap<String, Process> ffmpegProcesses = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, OutputStream> ffmpegInputs = new ConcurrentHashMap<>();

    private static final String AWS_RTMP_BASE_URL = "rtmp://13.61.192.21:1935/test/live";

    @Override
    public void handleBinaryMessage(@SuppressWarnings("null") WebSocketSession session, @SuppressWarnings("null") BinaryMessage message) {
        try {
            OutputStream ffmpegInput = ffmpegInputs.get(session.getId());
            if (ffmpegInput != null) {
                System.out.println("Received binary message from " + session.getId() + ": " + message.getPayload().array().length + " bytes");
                ffmpegInput.write(message.getPayload().array());
                ffmpegInput.flush();
            }
        } catch (IOException e) {
            System.err.println("Error writing to FFmpeg process: " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionEstablished(@SuppressWarnings("null") WebSocketSession session) {
        System.out.println("WebSocket connection established: " + session.getId());
        session.setBinaryMessageSizeLimit(1024 * 1024 * 10);  // 10 MB
        startFFmpegProcess(session.getId());
    }

    @Override
    public void afterConnectionClosed(@SuppressWarnings("null") WebSocketSession session, @SuppressWarnings("null") CloseStatus status) {
        System.out.println("WebSocket connection closed: " + session.getId() + " with status: " + status);
        stopFFmpegProcess(session.getId());
    }

    private void startFFmpegProcess(String sessionId) {
        try {
            String streamUrl = AWS_RTMP_BASE_URL;
            ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg", "-re", "-i", "pipe:0",
                "-c:v", "libx264", "-preset", "ultrafast", "-tune", "zerolatency",
                "-c:a", "aac", "-b:a", "128k",
                "-f", "flv", streamUrl
            );

            Process ffmpegProcess = processBuilder.start();
            ffmpegProcesses.put(sessionId, ffmpegProcess);
            ffmpegInputs.put(sessionId, ffmpegProcess.getOutputStream());

        } catch (IOException e) {
            System.err.println("Error starting FFmpeg for session " + sessionId + ": " + e.getMessage());
        }
    }

    private void stopFFmpegProcess(String sessionId) {
        try {
            if (ffmpegInputs.containsKey(sessionId)) {
                ffmpegInputs.get(sessionId).close();
                ffmpegInputs.remove(sessionId);
            }
            if (ffmpegProcesses.containsKey(sessionId)) {
                ffmpegProcesses.get(sessionId).destroy();
                ffmpegProcesses.remove(sessionId);
            }
        } catch (IOException e) {
            System.err.println("Error stopping FFmpeg for session " + sessionId + ": " + e.getMessage());
        }
    }
}

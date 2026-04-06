package com.mediscan.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;

import java.security.Principal;

@Controller
public class WebSocketController {
    
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public String handleMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required for WebSocket messaging");
        }

        // Extract user session info if needed
        @SuppressWarnings("unused")
        String sessionId = headerAccessor.getSessionId();
        
        // Echo message back to all subscribers
        return message;
    }
    
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/messages")
    public String addUser(@Payload String user, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required for WebSocket messaging");
        }

        // Handle user join
        return user + " joined the chat";
    }
    
}

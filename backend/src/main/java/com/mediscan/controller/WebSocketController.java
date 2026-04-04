package com.mediscan.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

@Controller
public class WebSocketController {
    
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public String handleMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        // Extract user session info if needed
        String sessionId = headerAccessor.getSessionId();
        
        // Echo message back to all subscribers
        return message;
    }
    
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/messages")
    public String addUser(@Payload String user, SimpMessageHeaderAccessor headerAccessor) {
        // Handle user join
        return user + " joined the chat";
    }
    
}

# MindBit  
An AI-powered social gaming platform built around personality insights

## Demo
- **YouTube:** https://youtu.be/tcxaj2Yhb68

---

## Overview

MindBit is a full-stack web application that combines personality analysis, AI-assisted game discovery, and real-time social interaction. Users can take an MBTI-based personality test, receive curated and AI-generated game recommendations, and connect with others through chat and video calls—all within a secure, login-protected platform.

The project was built to explore scalable backend design, real-time communication, AI integration, and production-style deployment using containerized services.

---

## Key Features

### Authentication & Security
- Username/password authentication and Steam OpenID login
- Optional TOTP-based two-factor authentication (Google Authenticator / Authy)
- Session-based access control for all protected features

### MBTI Personality System
- 50-question MBTI test with detailed scoring across personality axes
- Cognitive function and confidence score breakdown
- Persistent storage of test history for long-term personality tracking
- Manual MBTI selection supported with descriptive summaries

### AI-Powered Game Recommendations
- Default MBTI-based game recommendations
- AI-generated recommendations using Perplexity API
- Validation of all AI outputs using official Steam APIs to prevent hallucinations
- Ability to like and save favorite games with direct Steam links

### Social Platform
- User discovery via username, MBTI, and profile attributes
- MBTI similarity-based friend recommendations
- Friend request and friend list system
- Real-time chat with persistent message history
- One-on-one video calling using WebRTC
- Online/offline presence indicators

---

## Tech Stack

### Frontend
- Next.js, React, TypeScript
- MUI (Material UI)
- Client-side authentication checks and protected routing

### Backend
- Node.js, Express, TypeScript
- MongoDB with Mongoose
- REST API architecture
- Socket.IO for real-time communication
- WebRTC signaling server for video calls

### Third-Party APIs & Libraries
- Steam Store APIs (game metadata and validation)
- Perplexity AI API (personality-aware recommendations)
- Steam OpenID (third-party authentication)
- otplib (TOTP-based 2FA)

---

## Architecture Overview

The application follows a modular frontend-backend separation with a REST API and real-time communication layer.

### Backend Structure
- Feature-organized routes (auth, profile, MBTI, games, social, chat)
- Mongoose models for users, MBTI results, messages, games, and social relationships
- Socket.IO-based signaling server for chat and WebRTC video calls
- Strong typing via shared TypeScript definitions

### Real-Time Communication
- Peer-to-peer video calls using WebRTC
- Socket.IO signaling for offers, answers, ICE candidates, and call lifecycle
- Message persistence with real-time delivery

---

## Deployment

- Fully containerized using Docker and Docker Compose
- Nginx reverse proxy with automatic HTTPS via Let’s Encrypt
- Frontend and backend deployed as separate services on a cloud VM
- Secure internal networking with external HTTPS-only access
- Environment-based configuration for API keys and secrets

---

## Engineering Challenges Solved

- Designing a login-aware, stateful frontend without server-side rendering
- Implementing reliable WebRTC signaling behind an Nginx reverse proxy
- Preventing AI hallucinations by validating AI output against authoritative APIs
- Maintaining real-time performance while ensuring persistence and security

---

## My Contributions

- Backend architecture, API design, and database modeling
- Authentication system including Steam login and TOTP-based 2FA
- AI-powered game recommendation pipeline with validation layer
- Real-time chat and WebRTC video calling infrastructure
- Dockerized deployment, reverse proxy configuration, and SSL setup
- Backend debugging, performance tuning, and stability improvements

---

## Why This Project Matters

MindBit was built as a production-style system rather than a prototype.  
It demonstrates practical experience with:
- Full-stack TypeScript development
- Real-time systems and networking concepts
- Secure authentication and user data handling
- AI integration with guardrails
- Cloud deployment and containerized infrastructure

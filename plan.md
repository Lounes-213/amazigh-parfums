# Amazigh — Feature Implementation Plan

## Overview
All the changes requested, organized in execution order.

## Phase 1: Database Schema Updates (D1)
- Add `price` (REAL), `price_visible` (INTEGER DEFAULT 1) columns to perfumes
- Add `settings` table for: logo_url, bg_video_url, order_method (whatsapp/sms/app), notification_token

## Phase 2: Backend Worker Updates
- Update CRUD to handle price, price_visible
- Add settings API endpoints (GET/PUT /api/settings)
- Add video upload endpoint (max 50MB)
- R2 cleanup on image/video delete or replace
- Web Push notification on new order
- Order notification endpoint

## Phase 3: Main Site Updates
- Fix "58 Wilayas" → "69 Wilayas"
- Fix "Alger • Grasse • Dubaï" → "Tizi Ouzou • Alger • Oran"
- Show prices (if visible) on product cards
- Dynamic background video from R2
- Dynamic logo from R2
- Order via WhatsApp/SMS choice

## Phase 4: Admin Panel Updates
- Price field + show/hide toggle in perfume form
- Image preview in admin cards
- Logo upload section
- Background video upload (max 50MB)
- Order method config (WhatsApp/SMS/App)
- Web Push notification setup

## Phase 5: Upload existing assets to R2
- Upload all images from public/images/
- Upload videos from public/ and public/vedio_3d/
- Upload logo

## Phase 6: Redeploy everything

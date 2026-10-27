# MotoFix

A full-stack web platform for vehicle (car and motorcycle) service, parts, and customization. Customers can request roadside assistance, find nearby mechanics, shop for parts, and design custom builds. Vendors manage their services and respond to requests, and admins approve vendors.

Built as the CSE471 course project at BRAC University.

Features:

Role-based accounts: customer, vendor, and admin, with JWT authentication and bcrypt password hashing

Roadside assistance: customers submit a request with their location and issue type (flat tire, battery failure, engine trouble, other), see ranked nearby mechanics on a map, pick one, and track the request from Pending to Completed

Ratings and reviews after a request is completed

Vendor dashboard: manage services and availability, and accept or reject incoming requests

Admin panel: approve, reject, or suspend vendors

Parts shop: search parts, add them to a cart, and place orders

Online payment through the SSLCommerz gateway (sandbox mode by default)

Vehicle garage and customization: choose a vehicle, pick customization options, save builds, and share them with a link

AI Mod Advisor: describe a goal in plain language and get recommended customization options from an LLM (Groq API)

Maps and routing with Leaflet and OpenRouteService

Email notifications with Nodemailer

Tech Stack

Frontend:	React, Vite, React Router, Tailwind CSS, Leaflet

Backend:	Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Nodemailer

Integrations:	SSLCommerz, OpenRouteService, Groq API

Deployment:	Vercel

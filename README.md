# Palabeo

A language learning application that transforms vocabulary acquisition into an engaging, card-collecting experience. Built with Next.js, TypeScript, and Tailwind CSS, Palabeo helps users learn new languages by collecting and practicing words like trading cards.

## Features

### Core Functionality

- **Word Collection**: Add and manage vocabulary words with translations, examples, and word types
- **Interactive Practice**: Quiz-based learning system with timed challenges
- **User Authentication**: Secure login and registration system

### Technical Features

- **Type Safety**: Full TypeScript implementation
- **Database Management**: PostgreSQL with Prisma ORM
- **API Rate Limiting**: Built-in protection against API abuse
- **Input Validation**: Comprehensive data validation and sanitization
- **Testing**: Unit tests with Vitest and React Testing Library

## 🚧 Current Status

**This project is currently in development and requires additional setup to run:**

- A private WordReference API proxy is needed for translation functionality
- The application cannot be used standalone without the external translation service
- This repository serves as a demonstration of the frontend and core application logic

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL, Prisma ORM
- **Testing**: Vitest, React Testing Library

## License

This project is private and personal. Please respect the intellectual property and do not use without permission.

## Related Projects

- [WordReference API Proxy] - Private API proxy for translation services (private for the moment)

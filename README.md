# Spektrum

Spektrum is a vibe coding service that lets developers generate applications on demand and integrate them directly into their products.

![spektrum](https://github.com/user-attachments/assets/7342c8f5-67f0-4515-85fc-5db8cf1668e1)

## Architecture

This project follows hexagonal architecture with three main layers:

- **Application Layer**: Contains use cases and application services
- **Domain Layer**: Contains business logic and domain entities
- **Infrastructure Layer**: Contains external dependencies, database, and API implementations

## Domain Driven Design

This project is implemented with Domain Driven Design (DDD) in mind. The main guidelines are based on the "Domain-Driven Design: Tackling Complexity in the Heart of Software" by Eric Evans (the blue book).

## Running the Server

```bash
npm run start
```

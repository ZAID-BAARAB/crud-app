# backend/Dockerfile

# Use JDK base image
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy JAR from local target folder to container
COPY target/*.jar app.jar

# Set environment variable to use docker profile (optional if passed via compose)
ENV SPRING_PROFILES_ACTIVE=docker

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]

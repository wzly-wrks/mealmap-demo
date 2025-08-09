# Contributing to MealMap Demo

Thank you for your interest in contributing to MealMap Demo! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to project@ninjatech.ai.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/mealmap-demo.git
   cd mealmap-demo
   ```
3. Add the original repository as an upstream remote
   ```bash
   git remote add upstream https://github.com/wzly-wrks/mealmap-demo.git
   ```
4. Install dependencies
   ```bash
   npm install
   ```
5. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. Make your changes in your feature branch
2. Keep your branch updated with the upstream main branch
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
3. Run tests to ensure your changes don't break existing functionality
   ```bash
   npm test
   ```
4. Ensure your code follows the project's coding standards
   ```bash
   npm run lint
   ```
5. Commit your changes with clear, descriptive commit messages
   ```bash
   git commit -m "Add feature: your feature description"
   ```

## Pull Request Process

1. Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a pull request from your fork to the main repository
3. Ensure your PR description clearly describes the problem and solution
4. Include any relevant issue numbers in the PR description
5. Update the README.md or documentation with details of changes if applicable
6. The PR requires approval from at least one maintainer before it can be merged

## Coding Standards

This project follows the Airbnb JavaScript Style Guide with some modifications. Key points:

- Use 2 spaces for indentation
- Use single quotes for strings
- End statements with semicolons
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Add JSDoc comments for all functions and classes
- Keep lines under 100 characters
- Write self-documenting code with clear variable and function names

## Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Aim for high test coverage of your code
- Tests should be placed in the `__tests__` directory adjacent to the code being tested

## Documentation

- Update documentation when changing functionality
- Document all functions, classes, and components with JSDoc comments
- Keep the README.md updated with any new features or changes
- Create or update examples when adding new features

## Issue Reporting

When reporting issues, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Your environment details (browser, OS, etc.)
7. Any additional context that might be helpful

## Feature Requests

Feature requests are welcome! When submitting a feature request:

1. Use a clear, descriptive title
2. Provide a detailed description of the feature
3. Explain why this feature would be useful
4. Suggest an implementation approach if possible
5. Include mockups or examples if applicable

Thank you for contributing to MealMap Demo!
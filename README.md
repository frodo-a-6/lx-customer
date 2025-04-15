# LX Customer Management

Monorepo for a customer management system.

## Status
[![Build and Test Spring Boot Backend](https://github.com/frodo-a-6/lx-customer/actions/workflows/backend-build.yaml/badge.svg)](https://github.com/frodo-a-6/lx-customer/actions/workflows/backend-build.yaml)

## Installation

### Infrastructure
```shell
cd infrastructure
npm install
npm run build
npm run test
npx cdk bootstrap --profile <your-profile>
npx cdk deploy --profile <your-profile>
cd ..
```

### Backend
```shell
cd backend
./gradlew build
cd ..
```

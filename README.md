﻿# LX Customer Management

Monorepo for a customer management system.

## Status
[![CI & CD Spring Boot Backend](https://github.com/frodo-a-6/lx-customer/actions/workflows/backend-ci-cd.yaml/badge.svg)](https://github.com/frodo-a-6/lx-customer/actions/workflows/backend-ci-cd.yaml)
[![CI & CD ReactJS Frontend](https://github.com/frodo-a-6/lx-customer/actions/workflows/frontend-ci-cd.yaml/badge.svg)](https://github.com/frodo-a-6/lx-customer/actions/workflows/frontend-ci-cd.yaml)

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

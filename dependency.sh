#!/bin/bash
# Check Docker Version
echo "Docker Version: " $(docker --version);

# Check Docker Compose Version
echo "Docker Compose Version: " $(docker-compose --version);

# Check NodeJS version
echo "NodeJS Version: " $(node --version);

# Check TypeScript version
echo "TypeScript Version: " $(tsc --version);

# Check npm version
echo "npm Version: " $(npm --version);
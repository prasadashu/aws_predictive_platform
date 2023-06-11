#!/bin/bash

# Define function to check and install Node.JS
checkAndInstallNodeJS(){
    # Check if NodeJS is not installed
    if ! node --version &> /dev/null; then
        echo "Node.JS is not installed"
        echo "Installing Node.JS..."

        # Update apt package repository links
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        # Install Node.JS
        sudo apt install nodejs

        # Verify if Node.JS got installed
        if ! node --version &> /dev/null; then
            echo "Error while installing Node.JS";
        else
            echo "Node.JS installed";
            echo "Node.JS Version: $(node --version)";
}

# Define function to check and install TypeScript
checkAndInstallTypeScript(){
    # Check if TypeScript is not installed
    if ! tsc --version &> /dev/null; then
        echo "TypeScript is not installed";
        echo "Installing TypeScript...";

    # Install TypeScript
    apt install node-typescript;

    # Verify if TypeScript was installed
    if ! tsc --version &> /dev/null; then
        echo "Error while installing TypeScript";
    else
        echo "TypeScript installed";
        echo "TypeScript Version: $(tsc --version)";
}

# Define function to check and install AWS CLI
checkAndInstallAWSCli(){
    # Check if AWS CLI is not installed
    if ! aws --version &> /dev/null; then
        echo "AWS CLI is not installed";
        echo "Installing AWS CLI...";

    # Install AWS CLI
    apt install awscli

    # Verify if AWS CLI was installed
    if ! aws --version &> /dev/null; then
        echo "Error while installing AWS CLI";
    else
        echo "AWS CLI installed";
        echo "AWS CLI Version: $(aws --version)";
}

# Check Docker Version
echo "Docker Version: " $(docker --version);

# Check Docker Compose Version
echo "Docker Compose Version: " $(docker-compose --version);

# Check NodeJS version
checkAndInstallNodeJS();

# Check TypeScript version
checkAndInstallTypeScript();

# Check AWS CLI version
checkAndInstallAWSCli();
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
        sudo apt install -y nodejs

        # Verify if Node.JS got installed
        if ! node --version &> /dev/null; then
            echo "Error while installing Node.JS";
        else
            echo "Node.JS installed";
            echo "Node.JS Version: $(node --version)";
        fi
    else
        echo "Node.JS Version $(node --version)";
    fi
}

# Define function to check and install TypeScript
checkAndInstallTypeScript(){
    # Check if TypeScript is not installed
    if ! tsc --version &> /dev/null; then
        echo "TypeScript is not installed";
        echo "Installing TypeScript...";

        # Install TypeScript
        apt install -y node-typescript;

        # Verify if TypeScript was installed
        if ! tsc --version &> /dev/null; then
            echo "Error while installing TypeScript";
        else
            echo "TypeScript installed";
            echo "TypeScript Version: $(tsc --version)";
        fi
    else
        echo "TypeScript Version $(tsc --version)";
    fi
}

# Define function to check and install AWS CLI
checkAndInstallAWSCli(){
    # Check if AWS CLI is not installed
    if ! aws --version &> /dev/null; then
        echo "AWS CLI is not installed";
        echo "Installing AWS CLI...";

        # Install AWS CLI
        curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip";
        unzip /tmp/awscliv2.zip -d /tmp;
        sudo /tmp/aws/install;

        # Verify if AWS CLI was installed
        if ! aws --version &> /dev/null; then
            echo "Error while installing AWS CLI";
        else
            echo "AWS CLI installed";
            echo "AWS CLI Version: $(aws --version)";
        fi
    else
        echo "AWS CLI Version $(aws --version)";
    fi
}

# Define function to check and install ZIP
checkAndInstallZIP(){
    # Check if ZIP is not installed
    if ! aws -v &> /dev/null; then
        echo "ZIP is not installed";
        echo "Installing ZIP...";

        # Install ZIP
        apt install -y zip

        # Verify if ZIP was installed
        if ! zip -v &> /dev/null; then
            echo "Error while installing ZIP";
        else
            echo "ZIP installed";
            echo "ZIP Version: $(zip -v)";
        fi
    else
        echo "ZIP Version $(zip -v)";
    fi
}

# Define function to check and install JQ
checkAndInstallJQ(){
    # Check if JQ is not installed
    if ! jq --version &> /dev/null; then
        echo "JQ is not installed";
        echo "Installing JQ...";

        # Install JQ
        apt -y  install jq

        # Verify if JQ was installed
        if ! jq --version &> /dev/null; then
            echo "Error while installing JQ";
        else
            echo "JQ installed";
            echo "JW Version: $(jq --version)";
        fi
    else
        echo "JQ Version $(jq --version)";
    fi
}

# Check Docker Version
echo "Docker Version: " $(docker --version);

# Check Docker Compose Version
echo "Docker Compose Version: " $(docker-compose --version);

# Check NodeJS version
checkAndInstallNodeJS

# Check TypeScript version
checkAndInstallTypeScript

# Check AWS CLI version
checkAndInstallAWSCli

# Check ZIP version
checkAndInstallZIP

# Check JQ version
checkAndInstallJQ
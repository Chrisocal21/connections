#!/bin/bash

# Initialize Git repository if not already initialized
if [ ! -d .git ]; then
    git init
    echo "Git repository initialized"
fi

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Connections Game"

# Prompt for GitHub repository URL
echo "Enter your GitHub repository URL:"
read repo_url

# Add GitHub remote
git remote add origin $repo_url

# Push to GitHub
git branch -M main
git push -u origin main

echo "Setup complete! Repository pushed to GitHub"

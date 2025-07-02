#!/bin/zsh

sudo chown -R vscode:vscode node_modules
sudo chown -R vscode:vscode tests
bun install --frozen-lockfile

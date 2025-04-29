@echo off
echo Checking environment...
echo Current directory: %CD%
echo Node version:
node --version
echo NPM version:
npm --version
echo MongoDB status:
sc query MongoDB
echo Environment variables:
set
echo Done.

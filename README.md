# MlNDE Web Client

The Web application for Machine Learning in Network Denied Enviornments(MlNDE) Senior capstone project.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Sponser](#sponser)

## Overview
This web client will server two main functions for the MlNDE system, handles verification of newly submitted images to the server, and control models versions on the server.
The client is meant to be a graphic user interface for the server and is able to start the fine tuning process on verified images.
Unverified images are manually verified and can update their labels with new ones from the server or by the user.


### MlNDE Systems
- [Mobile Client](https://github.com/kevinmaravillas/MobileClient)
- [Server](https://github.com/Chaoward/MlNDE_Server)


## Features
- **Relabeling Images**
  - *System Labels*: labels from MobileNet
  - *User Labels*: text labels by the user
- **Verifying Images from Server**
- **Display and Sort ML Model Versions**
- **Set Release and Delete Model Versions**
- **Upload Images with Labels**


## Installation

### Getting Started
Before installing, check to see if you have Node.JS and npm installed. Node.JS should have npm preinstalled.

### 1. Go into Directory "admin-web-client"
After cloning this repo, open a terminal and cd into the *admin-web-client* directory. You should see the *package.json* file in that directory.

### 2. Install Dependencies
run the following command to install dependencies
```sh
npm i
```

In case of an error, try running the following
```sh
npm audit fix
```

### 3. Running the Client
Once all dependencies are installed, you can start up the web client.
```sh
npm start
```
or
```sh
npm run dev
```

## Sponser
Proudly sponsored by NSIN/ICT USC and Cal State LA Senior Capstone

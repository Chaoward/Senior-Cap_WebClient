# MlNDE Web Client

Machine Learning for Network-Denied Environments (MlNDE) is a machine learning project aimed at demonstrating the effectiveness of a hybrid approach to distributing software solutions to network-denied environments. The project combines a cloud-based server with a web user interface, and an offline mobile app with an image classification AI model that can be incrementally fine-tuned server-side.
With these componenets, MlNDE explores a peer-to-peer method for delivering updates to machince learning models on devices with little-to-no internet connection.

For more about the project visit [here](https://ascent.cysun.org/project/project/view/206) or view the [presentation slides](https://docs.google.com/presentation/d/13EFhmbbCMPtfYBnF4iBhyzKesb5ix88vZ7o3OJCPOOM/edit?usp=sharing)

### MlNDE Systems
- [Mobile Client](https://github.com/kevinmaravillas/MobileClient/tree/Main)
- [Web Client](https://github.com/Chaoward/Senior-Cap_WebClient)


# About the Web Client
This web client will serve two main functions for the MlNDE system, one handles verification of newly submitted images to the server, and two control models versions on the server.
The client is meant to be a graphic user interface for the server and is able to signal the server to start the fine tuning process on verified images.
Unverified images are manually verified and can update their labels with new ones from the server or by the user.
Different model versions that exist on the server can have their information displayed, as well as the option to delete a version and mark a version as the "release" version.

### Verification Page

https://github.com/Chaoward/Senior-Cap_WebClient/assets/57738845/730e0e40-5d8b-4428-8de8-8c4c027e5878



### Version Control Page

https://github.com/Chaoward/Senior-Cap_WebClient/assets/57738845/8487594e-4963-49ec-81ec-1b39695d5564



## Features
- **Relabeling Images**
  - *System Labels*: labels from MobileNet
  - *User Labels*: text labels by the user
- **Verifying Images from Server**
- **Display and Sort ML Model Versions**
- **Set Release and Delete Model Versions**
- **Upload Images with Labels**


# Installation

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

## Sponsor
Proudly sponsored by NSIN/ICT USC and Cal State LA Senior Capstone

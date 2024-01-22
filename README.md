# Eqaim - SASS feedback app solution

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Steps](#steps)
  - [Installation](#Installation)
  - [Data Query](#Data_Query)
  - [Authentication](#Authentication)
  - [Logging](#Logging)
  - [Future Enhancements](#Future_Enhancements)

## Overview

Eqaim is a feedback app developed using the MERN stack, which includes Next.js, TypeScript, SCSS, and MongoDB. This platform is designed to cater to developers, allowing them to contribute valuable suggestions to enhance various aspects of the website, such as improving dark mode or optimizing preview image loading. The website is responsive across different screen sizes, ensuring a seamless user experience. Developers can submit suggestions in different categories, including UI, UX, enhancement, bug, and feature. These suggestions can go through various stages, from the default suggestion status to planning, in-progress, and finally, live. The home screen serves as a central hub where developers can view allsuggestions and upvote suggestions, add comments, and engage in discussions, fostering a collaborative environment for continuous improvement and innovation.

Sample Images

![eqaim (3)](https://github.com/PavanGuptaZ/eqaim-fb-board/assets/144094802/10f9efe4-340c-42f8-b2b4-f80660b13b9d)

![eqaim (1)](https://github.com/PavanGuptaZ/eqaim-fb-board/assets/144094802/bd12dfd0-25e5-4eb2-97ff-ecd806b2fd4f)

![eqaim (2)](https://github.com/PavanGuptaZ/eqaim-fb-board/assets/144094802/653eca88-7600-45fd-b047-d46ca789ff6b)

### Suggestions Life Cycle

- Any Developers submit suggestions related to UI, UX, enhancement, bug, or new features.
- Suggestions start with a default status, indicating they are newly submitted and awaiting UpVotes.
- If Certain revieved to suggestions, any developer can move suggestions to the planning stage, where the development team considers their feasibility and potential impact.
- Accepted suggestions move into the in-progress stage, indicating active development or implementation.
- Throughout this process, suggestions are visible on the home screen and RoadMap screen, allowing developers to track progress and provide input.
- Once development is complete, suggestions transition to the live status, indicating successful implementation in the application.
- Developers can continuously provide feedback, comments, and upvotes during any stage of the suggestion life cycle.
- The nature of the suggestion life cycle encourages a responsive and user-focused development approach, enhancing the overall quality of the Eqaim application.

### Installation:
Clone the repository to your local machine:
```bash
git clone https://github.com/PavanGuptaZ/eqaim-fb-board.git
```

#### Setup Environment keys
Create .env files in both the frontend and backend folders:
##### In the Backend folder add the following variables
-	DATABASE_URL (MongoDB connection string)
-	ACCESS_TOKEN (Secret Key)
-	REFRESH_TOKEN (Secret Key)

add Frontend origin in - backend/config/allowed origin.js

````JavaScript
const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.0.107:300'
    'ADD REQUIRE ORIGINS'
]

export default allowedOrigins
````

it is going to help on CORS

##### In the Frontend folder add the following variables
- NEXT_PUBLIC_BACKEND_LINK (Link to the backend server)

#### ToRun
Navigate to the frontend and backend folders in the terminal and run

##### for frontend
````bash
  cd frontend
  npm install
  npm run dev
````

##### for backend
````bash
  cd backend
  npm install
  npm run dev
````

Check DATABASEURL and NEXT_PUBLIC_BACKEND_LINK in the respective .env files and update if necessary.


### Data_Query:
The entire project uses the Fetch API for network requests, and React Query (also known as Transatck Query) for managing asynchronous data.


### Authentication:
- Passwords are hashed using Bcrypt.
- ACCESS_TOKEN and REFRESH_TOKEN are generated using Jsonwebtoken.
- REFRESH_TOKEN is generated only during user login.
- ACCESS_TOKEN is regenerated upon expiration by checking REFRESH_TOKEN.

### Logging:
- Custom logger function records every entry in the logs folder and `console.log()` simultaneously.

###	Future_Enhancements:
-	as of now UpVotes is not working
-	as of now Custom Profile image is not Avaliable, but userName is Unique with than developers can identify another developers 
-	as of now ACCESS_TOKEN and REFRESH_TOKEN process is not properly utilized 
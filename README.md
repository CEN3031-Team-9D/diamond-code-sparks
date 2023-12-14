# Code Sparks

A web platform for visual programming assignments in K-12 classrooms

## Acknowledgments

Code Sparks is built upon [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html), [React](https://reactjs.org/), [Node](https://nodejs.org/en/), [Blockly](https://developers.google.com/blockly), [Chromeduino](https://github.com/spaceneedle/Chromeduino), and [Create React App](https://create-react-app.dev/docs/getting-started/). In addition to the existing dependencies of Code Sparks, our project uses two external libraries: [prop-types](https://www.npmjs.com/package/prop-types) and [@uiw/react-markdown-editor](https://www.npmjs.com/package/@uiw/react-markdown-editor).

## Running

1. Install [Node](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable), [Docker](https://docs.docker.com/get-docker/), and [Google Chrome](https://www.google.com/chrome/)
2. Run `yarn` from `/client` to install project dependencies
3. Run `yarn start` from `/client` to startup the client (please note that much of the functionality will not work without also starting up the backend services)
4. Navigate to `chrome://flags/` in Google Chrome and enable the `#enable-experimental-web-platform-features` flag (this will provide your browser access to serial ports)
5. Open Docker Desktop and run `docker compose up` from `/` to startup the backend services
    * Elevate permissions if you encounter any errors

Now the application can be accessed at `localhost:3000` in Google Chrome. The Strapi panel can be accessed at `localhost:1337/admin` in any browser. As the database and server are hosted locally, the client should automatically connect to them, and no additional labor should be necessary.

## Features

* "Your Lessons" tab on the classroom manager dashboard
  ![](https://raw.githubusercontent.com/CEN3031-Team-9D/diamond-code-sparks/develop/images/your_lessons.jpg)
* Markdown editor for long activity descriptions
  ![](https://raw.githubusercontent.com/CEN3031-Team-9D/diamond-code-sparks/develop/images/long_description.jpg)
* Button allowing teachers to transfer students between their classes
  ![](https://raw.githubusercontent.com/CEN3031-Team-9D/diamond-code-sparks/develop/images/transfer.jpg)
* Sharing lessons with other teachers
  ![](https://raw.githubusercontent.com/CEN3031-Team-9D/diamond-code-sparks/develop/images/teacher.PNG)
* Distrbuting lessons amongst owned classes
  ![](https://github.com/CEN3031-Team-9D/diamond-code-sparks/assets/40278799/123ec756-d810-4283-84f6-50000cc44b39)
* Classroom view with inactive & active classes
  ![](https://github.com/CEN3031-Team-9D/diamond-code-sparks/assets/40278799/f18322e9-a842-47cf-ab31-d3c09c67d149)

  
## Outstanding Work

* Fix View Lessons bug
* Fix teacher activity template bug
* Update dependencies


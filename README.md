
# Koriko Courier Service Interactive

The application has two utilities via a command-line tool
- Calculates Total Courier cost for the given packages.
- Calculates Estimated Delivery time for the given packages.


## Usage
### Recommended Way (with Docker)
Please ensure **Docker** is installed on your system.
>Install Docker for your platform: https://docs.docker.com/engine/install/
>
<br />

The application can be run using the following commands **(the first run will take longer).**

> Download the repository as zip or git clone [https/ssh url] and 'cd' to project root

One Time => **(sudo) docker build -t <image_name> .**
>**sudo docker build -t kci_visd .**

<br />

Run Application => **(sudo) docker run --rm -it <image_name>**
> **sudo docker run --rm -it kci_visd**

<br />

### Alternative Way (without Docker)
Node Version: 20
> cd < path to project root >

> npm i

> npm build

> node dist/index.js

<br />

## Development
Codebase is based on Node.js.

### Pre-requisites
- Node.js version: 20
- git
> cd < path to project root >
> npm i
### Test
It uses the Jest testing framework.
> npm run test
### Build
> npm run build

<br />
<br />

## Contact

vishaldaga10@gmail.com

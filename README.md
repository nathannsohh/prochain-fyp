# ProChain

## Getting Started
A total of 6 terminals are required to run this application

- Frontend
- Backend
- Hardhat Node
- IPFS Node
- Graph Node
- Smart Contract Deployment and Subgraph Deployment

Run the terminals in this order to ensure a smooth environment set up.

### Frontend
```
$ cd frontend
$ npm run dev
```

### Backend
```
$ cd backend
$ node index.js
```

### Hardhat Node
In the root directory run:
```
$ npx hardhat node --hostname 0.0.0.0
```

### The Graph Node
To run the local graph node through this docker image, the following is required to be installed on the system:
- Docker - [Docker Installation](https://docs.docker.com/engine/install/)
- Rust (latest stable) - [Rust Installation](https://www.rust-lang.org/tools/install)
- PostgreSQL - [PostgreSQL Installation](https://www.postgresql.org/download/)
- IPFS - [IPFS Installation](https://docs.ipfs.tech/install/)

After installing the prerequisites, run the local node with these commands:
```
$ cd subgraphs // Navigate to the subgraphs directory
$ docker compose up
```

### Smart Contract Deployment and Subgraph Deployment
For Smart Contract Deployment, in the root directory run:
```
$ npx hardhat compile && npx hardhat run --network localhost scripts/deploy.js
```

To deploy the users subgraph, run:
```
$ cd subgraphs/subgraph_user
$ graph create users --node http://127.0.0.1:8020 && graph deploy users --ipfs http://127.0.0.1:5001 --node http://127.0.0.1:8020
```

To deploy the posts subgraph, run:
```
$ cd subgraphs/subgraph_post
$ graph create posts --node http://127.0.0.1:8020 && graph deploy posts --ipfs http://127.0.0.1:5001 --node http://127.0.0.1:8020
```

To deploy the jobs subgraph, run:
```
$ cd subgraphs/subgraph_job
$ graph create jobs --node http://127.0.0.1:8020 && graph deploy jobs --ipfs http://127.0.0.1:5001 --node http://127.0.0.1:8020
```

To deploy the job experience subgraph, run:
```
$ cd subgraphs/subgraph_job_experience
$ graph create jobExp --node http://127.0.0.1:8020 && graph deploy jobExp --ipfs http://127.0.0.1:5001 --node http://127.0.0.1:8020
```

To generate any of the type mappings for either of the subgraphs, navigate to the respective subgraph folder and run:
```
$ graph codegen
```

### IPFS Node
In the root directory run:
```
$ ipfs daemon
```
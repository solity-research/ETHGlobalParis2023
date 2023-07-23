# ETHGlobalParis2023
# CréditDécentrale

CréditDécentrale is a project created for the ETHParis '23 Hackathon. This project leverages blockchain technology to build a credit score calculator.

## Project Structure

The project is divided into four main folders such as blockchain, execution, frontend and zkServer.

Under the `blockchain` directory: there are two more directory as `bacalhau` and `lilypad`.

In the `bacalhau` folder, you'll find the necessary components to create a Docker image for the credit score calculator. The directory contains a Dockerfile for building the Docker image, Environment Variables for application configuration, and Status Images for a visual representation of status of the results in the report pdf.

Example command to build the Docker image:

	docker buildx build . --platform linux/amd64 --tag solityresearch/ethglobalparis23v3 --push

You can then run the Docker image as bacalhau with the following command:

	bacalhau docker run -e TARGET_ADDRESS=0x3999b51874cDcA2782Aaf9FD25d69a0d88808320 --network=http --domain=eth.public-rpc.com  --domain=polygon-rpc.com solityresearch/ethglobalparis23v3

In the lilypad folder, you'll find the smart contract code that we deployed in the Filecoin Virtual Machine (FVM), and its corresponding Application Binary Interface (ABI).

# ETHGlobalParis2023
# CréditDécentrale

CréditDécentrale is a project created for the ETHParis '23 Hackathon. Our project aims to address the existing issues in the current DeFi ecosystem by introducing a fresh breath of air in the decentralized credit system. The prevalent problem with traditional lending protocols is the heavy reliance on overcollateralization of assets, leading to inefficiencies and limited access to credit for borrowers. To overcome these challenges, we have designed a decentralized credit scoring system that leverages several technologies such as Bacalhau's Decentralized Computation , Filecoin’s Decentralized Storage as well as zkSNARKs for the private and secure score verification process.

The core functionality of our system revolves around the generation of a unique credit score for each user. This credit score serves as a measure of creditworthiness within the decentralized ecosystem just as in traditional finance. By utilizing zkSNARKs proofs, we ensure that the verification process is private, secure, and tamper-proof, preserving users' privacy and financial information.

The primary objective of the credit score is to enable lending protocols to offer better-personalized loans to users. Instead of requiring excessive collateralization, the credit score allows lenders to assess borrowers' creditworthiness accurately and offer loans that align with their financial standing and risk profile. This approach promotes financial inclusion and unlocks more opportunities for borrowers in the market. 
One of the key benefits for users is the ability to share their credit score without disclosing all of their assets. This feature allows users to explore loan offers from various lenders without revealing sensitive information, ensuring greater privacy and control over their financial data.

When users decide to take out a loan, they can generate credit score cards bound to their wallet address in a decentralized manner. These credit score cards act as immutable records, providing lenders with reliable and tamper-proof information about the user's creditworthiness. This process creates a transparent and trustworthy environment, fostering better relationships between borrowers and lenders.

Technologies Used:
Decentralized Computation: Bacalhau + Lilipad
Decentralized Storage: Filecoin + IPFS
Zero-Knowledge Proofs: zkSNARKs
Blockchain Platforms: WorldCoin, Polygon ZK &rarr; Semaphore, Ethereum ZK &rarr; Semaphore, Near
OTP-Based Push Mechanism for Authentication &rarr; Push Protocol
Price Oracles: 1Inch API, Chainlink

Our decentralized credit scoring system represents a step forward in the evolution of the financial landscape, offering more accessible and personalized credit options to users while preserving the security and privacy of their sensitive financial data. With our solution, we aim to foster a more inclusive and robust financial ecosystem for everyone. 

## Project Structure

The project is divided into four main folders such as blockchain, execution, frontend and zkServer.

Under the `blockchain` directory: there are two more directory as `bacalhau` and `lilypad`.

In the `bacalhau` folder, you'll find the necessary components to create a Docker image for the credit score calculator. The directory contains a Dockerfile for building the Docker image, Environment Variables for application configuration, and Status Images for a visual representation of status of the results in the report pdf.

Example command to build the Docker image:

	docker buildx build . --platform linux/amd64 --tag solityresearch/ethglobalparis23v3 --push

You can then run the Docker image as bacalhau with the following command:

	bacalhau docker run -e TARGET_ADDRESS=0x3999b51874cDcA2782Aaf9FD25d69a0d88808320 --network=http --domain=eth.public-rpc.com  --domain=polygon-rpc.com solityresearch/ethglobalparis23v3

In the lilypad folder, you'll find the smart contract code that we deployed in the Filecoin Virtual Machine (FVM), and its corresponding Application Binary Interface (ABI).

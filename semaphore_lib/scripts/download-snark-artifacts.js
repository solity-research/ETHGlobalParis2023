"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var SemaphoreGroupsABI = require('../abis/SemaphoreGroupsABI.json');
var identity_1 = require("@semaphore-protocol/identity");
var proof_1 = require("@semaphore-protocol/proof");
var privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
// we get this with npx hardhat node and this is setup in hardhat.config.ts
var provider = new ethers_1.ethers.providers.JsonRpcProvider('http://0.0.0.0:8545');
var signer = new ethers_1.ethers.Wallet(privateKey, provider);
// Contract details
var semaphoreGroupsAddress = '0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131';
var semaphoreGroupsContract = new ethers_1.ethers.Contract(semaphoreGroupsAddress, SemaphoreGroupsABI, signer);
var admin = signer.address; // this is "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" but should be our frontend controlled wallet
// Function parameters
var groupId = 73; //example value
var merkleTreeDepth = 16; // example value but should be between 16 and 32
// this is done on-chain mumbai
function createNewGroup() {
    return __awaiter(this, void 0, void 0, function () {
        var verifierAddress, tx, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log("Verifier Address:");
                    return [4 /*yield*/, semaphoreGroupsContract.verifier()];
                case 1:
                    verifierAddress = _a.sent();
                    // This is correctly fetched
                    console.log(verifierAddress);
                    console.log("Creating Group!");
                    return [4 /*yield*/, semaphoreGroupsContract.createGroup(groupId, merkleTreeDepth, admin)];
                case 2:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 3:
                    _a.sent();
                    console.log('Group created successfully!');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error creating group:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// this is done in the frontend
function createIDs() {
    var ID_U = new identity_1.Identity(); // Identity of User
    var ID_A = new identity_1.Identity(); // Identity of AAVE representative
    console.log(ID_U, ID_A);
    return { ID_U: ID_U, ID_A: ID_A };
}
function addNewCommitments(commitment_U, commitment_A) {
    return __awaiter(this, void 0, void 0, function () {
        var tx, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, semaphoreGroupsContract.addMemebers(groupId, [commitment_U, commitment_A])];
                case 1:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 2:
                    _a.sent();
                    console.log('Commitments added to group successfully!');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error creating group:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// PWD is given manually to address U from address A check @Dogukan's tablet
function generateNewProof(ID_U, address_U, address_A, pwd) {
    return __awaiter(this, void 0, void 0, function () {
        var externalNullifier, signal, _a, group, merkleTreeDuration, fullProof;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    externalNullifier = semaphoreGroupsContract.getMerkleTreeRoot(groupId);
                    signal = address_U + address_A + pwd // Address of AAVE concatenated with address of User concatenated with the password given manually from AAVE to the user. We are using that so that AAVE can be sure that we are doing it spcifically for them. 
                    ;
                    return [4 /*yield*/, semaphoreGroupsContract.groups(groupId)];
                case 1:
                    _a = _b.sent(), group = _a.group, merkleTreeDuration = _a.merkleTreeDuration;
                    return [4 /*yield*/, (0, proof_1.generateProof)(ID_U, group, externalNullifier, signal)]; // if we need the snark artifcat 
                case 2:
                    fullProof = _b.sent() // if we need the snark artifcat 
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
function validateProof(address_U, address_A, pwd, fullProof) {
    return __awaiter(this, void 0, void 0, function () {
        var merkleTreeRoot, signal, externalNullifier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, semaphoreGroupsContract.groups(groupId).merkleTreeRoot];
                case 1:
                    merkleTreeRoot = _a.sent();
                    signal = address_U + address_A + pwd // Address of AAVE concatenated with address of User concatenated with the password given manually from AAVE to the user. We are using that so that AAVE can be sure that we are doing it spcifically for them. 
                    ;
                    externalNullifier = semaphoreGroupsContract.getMerkleTreeRoot(groupId);
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, ID_U, ID_A, commitment_U, commitment_A;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createIDs(), ID_U = _a.ID_U, ID_A = _a.ID_A;
                    commitment_U = ID_U.getCommitment().toString();
                    commitment_A = ID_A.getCommitment().toString();
                    // onchain
                    return [4 /*yield*/, createNewGroup()];
                case 1:
                    // onchain
                    _b.sent();
                    // onchain
                    return [4 /*yield*/, addNewCommitments(commitment_U, commitment_A)];
                case 2:
                    // onchain
                    _b.sent();
                    // offchain
                    // I'm not sure what the identity here represents (if it is only commitment or everything concatinated) it should be that of U however
                    return [4 /*yield*/, generateNewProof(ID_U, "", "", "")
                        // await validateProof(address_U, )
                    ];
                case 3:
                    // offchain
                    // I'm not sure what the identity here represents (if it is only commitment or everything concatinated) it should be that of U however
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return process.exit(0); })
    .catch(function (error) {
    console.error(error);
    process.exit(1);
});

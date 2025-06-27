import { Client, Account, ID, Storage } from "appwrite";

const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

const account = new Account(client);
const storage = new Storage(client);

export { client, account, storage, ID };
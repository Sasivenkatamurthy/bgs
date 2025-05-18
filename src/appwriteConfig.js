import { Client, Storage, ID } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your endpoint
    .setProject('682797030012bd99b386'); // Replace with your Project ID

const storage = new Storage(client);

export { storage, ID };

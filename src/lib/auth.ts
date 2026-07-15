import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI || process.env.ONGODB_URI || process.env.DATABASE_URL;

const client = mongoUri ? new MongoClient(mongoUri) : null;
const db = client ? client.db("ZenBoard") : null;

export const auth = betterAuth({
  database: db && client ? mongodbAdapter(db, { client }) : undefined,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

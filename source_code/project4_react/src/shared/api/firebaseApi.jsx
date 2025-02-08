import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  type: "service_account",
  project_id: "eproject4-3c13d",
  private_key_id: "e85492724d35fa1a6b4a7c3a762581f9bed4cdf4",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv+Uj3fTfJvXbB\n96+1spf8kEOWbR8lHEO3bd1Lk/D+LzaAlZ6iCQ94b6DQNi6Q4IkniLKh4kwCO8DE\n8oHBAhCwtxAnDGPcD0joajc4LX5/ioHcKsvZZxz+8eDRSWaKrUoO/VrDdmCyMV/h\nyb0htU6ph9tLAtDyF9aSfXqZVdgU0nEPnwzFiMGHLT/vLp6bx5SZZdWZyX/dLC8a\nxnJBYCfimIQJkw9EWTKNdgLIqZuJgKBl5aq5FZ80yiC0E/dmlA5lvXnEhjjBDxYL\nFDWRZHYIzb0ZsaEd659NL1D99e5K+v4a4ilR2PYezP/sJck/5mnoxsPKSHFndo4j\nqRtvplLzAgMBAAECggEAF4qqe82JKpiJrC5WF+EyGwwztoqXqY/L8Vylx8gda+vm\nBzK8+6Fpq+uHIIO3HBOl1Z+ggi6zi3Lx+YcV27vKftGmvAqYy2ZSEyGujHntm+Ns\nNweUqNt2EhdKw8TljnTbXQEA5PhPvFcFpD+oaTuHr/9oU3Mnf9O3lXZq8dt9ol9B\nsbp1cv7LRdUFH90CY5dL/eakFpk6xOTORbFsNtGzlgK/x3pgXwz8KNrXc73Aweoj\nUhdxsCYJh/uF7pOc9Qj2GMILPjYyoy6e9kYYiwXfvovhhLEEzagJzLcXCVeINNhx\nltQZDS5BnQN8u3982ZDX3NqrtcRXHaygsbFnkE8pDQKBgQDtgHXRTc57WLY8+yuv\nBU1Hlrxv8WbNDZjBAEtJSfppfv96xj8g+4yfdlUHQEUZZ36g5cEqQ/gtfm/A1HhP\nj0AAyLnV5Ac4i1wHc3fNsOa0w7veYuPhn8Yy62pP9Cm4s0aqNgR/bkidzPRD97kV\nObjo3H8sfWaDKjezlgkcP+m9/wKBgQC9rgUJBze/eCsniugcBn5ItmBIpE2TuaU8\nieIaWGmou2N958VI4+R3tOO+atoisR0pHd3RbELfKcnm0AO7y00DLtffBrCVroBv\n0AGzmbOH/7CfJXOGJ+mNeKZle+PJMiHW6lmK9ZXIL9O/phtu1g115yNLi8ZxhDD8\n+Bwkc9JTDQKBgQDFBb83TeOP4az0c6zueWh9jeduugT88F2bJkJOXyd0It2PnSw7\nkVI76u9on4FzLK8YjOCszkvweaX9goT4Ay8mN14quQrgdoN2zuxA35LTvFh6iPDg\neCn0jeTYxQVjap2hkEQ07mkhNygfxj5tBECINHrvjmvfPcONoFaYb9DZQwKBgFZP\nIfFqvF4+kvxqQ5XFCp+RhRxozvgCSILUhvLP+jwSEIKQ/P9e223w/JR/0IRqrUcx\nVObfaUpcnIePbbN9HazuGsJcK+vgPIckUjHkJYIjwb2Y8AlCjg6WsLiK+CprymQd\nvOLzPtWZlbOmJON5OSTGKRROJN0wdo4VY9DedvzdAoGABiREQUtpUj1qMue2T329\nI9CpdHrPfFaTMqkxYulIl3cqfmwZNBPsbokoUYylfx/B5YmcIddkWh3KHHM1kXgQ\n4rAwzUo4aAzOSxEpf0xjYKHUpWrvCNjfv7uAFZpiX6HfkneltcMSlHgS/461Tv02\np81lN/f2W2ZWG5JR8Vzebw4=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-23h6d@eproject4-3c13d.iam.gserviceaccount.com",
  client_id: "110800036608927727507",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-23h6d%40eproject4-3c13d.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
  databaseURL: "https://eproject4-3c13d-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;

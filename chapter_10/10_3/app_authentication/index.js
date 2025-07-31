import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyView from "@fastify/view";
import handlebars from "handlebars";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyPassport from "@fastify/passport";
import Account from "./models/Account.js";

const app = Fastify();
const PORT = 3000;

await app.register(fastifyFormbody);
await app.register(fastifyView, {
  engine: { handlebars },
  root: "views",
});

await app.register(fastifyCookie);
await app.register(fastifySession, {
  secret: "a_very_secret_value_1!2@3#4$5%6^7&8*9(0)",
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
  saveUninitialized: false,
  resave: false,
});

await app.register(fastifyPassport.initialize());
await app.register(fastifyPassport.secureSession());

fastifyPassport.registerUserSerializer(async (user, request) => user.username);
fastifyPassport.registerUserDeserializer(async (username, request) => {
  const account = await Account.findByUsername(username);
  if (!account) {
    throw new Error("User not found");
  }
  return account;
});

fastifyPassport.use("local", Account.genStrategy());
fastifyPassport.use("jwt", Account.genJWTStrategy());

const loginFormVars = {
  signup: {
    title: "Sign up",
    message: "Already have an account?",
    route: "/account",
    switchPage: "login",
    showExtraFields: true,
  },
  login: {
    title: "Log in",
    message: "Need to create an account?",
    route: "/auth",
    switchPage: "signup",
    showExtraFields: false,
  },
};

app.get("/", async (request, reply) => {
  const { page } = request.query;
  const formVars = loginFormVars[page] || loginFormVars.signup;
  return reply.view("index", formVars);
});

app.post("/account", async (request, reply) => {
  const { username, password } = request.body;
  try {
    await Account.register(username, password);
    return reply.send({ message: "Account created." });
  } catch (e) {
    return reply.code(400).send({
      message: "Account creation failed.",
      error: e.message,
    });
  }
});

app.post("/auth", async (request, reply) => {
  try {
    await fastifyPassport.authenticate("local", { authInfo: false })(
      request,
      reply
    );
    if (request.user) {
      const { username } = request.user;
      return reply.send({ message: "Logged in.", username });
    }
  } catch (err) {
    return reply.code(401).send({
      message: "Authentication failed",
      error: "Invalid username or password",
    });
  }
});

// JWT API Routes
app.post(
  "/api/auth",
  { preValidation: fastifyPassport.authenticate("local", { session: false }) },
  async (request, reply) => {
    const { user: account } = request;
    const token = account.signJWT();
    return reply.send({ token });
  }
);

app.get(
  "/api/test",
  { preValidation: fastifyPassport.authenticate("jwt", { session: false }) },
  async (request, reply) => {
    return reply.send({ status: "Authenticated." });
  }
);

try {
  const address = await app.listen({ port: PORT, host: "127.0.0.1" });
  console.log(`App listening on ${address}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}

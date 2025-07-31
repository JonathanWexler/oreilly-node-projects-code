import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import dbConfig from "../db.js";
const { Sequelize, db } = dbConfig;

class Account extends Sequelize.Model {
  static async findByUsername(username) {
    const lowerCaseUsername = username.toLowerCase();
    return await this.findOne({ where: { username: lowerCaseUsername } });
  }

  static async register(username, password) {
    const existingAccount = await this.findByUsername(username);
    if (existingAccount) {
      throw new Error("Account already exists");
    }
    const account = this.build({ username });
    account.setPassword(password);
    return await account.save();
  }

  setPassword(password) {
    if (!password) {
      throw new Error("No password supplied.");
    }
    try {
      const bufferBytes = crypto.randomBytes(32);
      const salt = bufferBytes.toString("hex");
      const hashRaw = crypto.pbkdf2Sync(password, salt, 12000, 64, "sha512");
      this.set("hash", Buffer.from(hashRaw).toString("hex"));
      this.set("salt", salt);
    } catch (e) {
      throw new Error("Unable to hash password.");
    }
  }

  authenticate(password) {
    const { salt, hash } = this;
    if (!salt) {
      throw new Error("No salt found");
    }

    const hashRaw = crypto.pbkdf2Sync(password, salt, 12000, 64, "sha512");
    const currentHash = Buffer.from(hashRaw).toString("hex");

    return currentHash === hash;
  }

  static passportAuthenticate() {
    return async (username, password, done) => {
      try {
        const account = await this.findByUsername(username);
        if (!account) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = account.authenticate(password);
        if (isValid) {
          return done(null, account);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (err) {
        return done(err);
      }
    };
  }

  static serializeUser(account, done) {
    const { username } = account;
    done(null, username);
  }

  static async deserializeUser(username, done) {
    try {
      const foundAccount = await this.findByUsername(username);
      if (!foundAccount) {
        return done(new Error("User not found"));
      }
      done(null, foundAccount);
    } catch (err) {
      done(err);
    }
  }

  static genStrategy() {
    return new LocalStrategy(this.passportAuthenticate());
  }
}

Account.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    hash: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Account",
  }
);

Account.beforeCreate((account) => {
  account["username"] = account["username"].toLowerCase();
});

Account.sync();
export default Account;

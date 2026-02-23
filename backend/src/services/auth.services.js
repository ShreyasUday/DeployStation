import pool from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function signupuser({name, email, password}) {
    const existing = await pool.query(
        "select * from users where email = $1", [email]
    )

    if (existing.rows.length > 0) throw new Error("user already exists");

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        "insert into users (name,email,password) values ($1,$2,$3) returning *",
        [name, email, hash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );

    return token;   
}

export async function loginuser({ email, password }) {
    const existing = await pool.query("select * from users where email = $1", [email]);
    if (existing.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }

    const user = existing.rows[0];

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error("Invalid Credentials")
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    )

    return token;
}
import * as authServices from "../services/auth.services.js"
import pool from "../config/db.js"

export const login = async (req, res) => {
    try {
        const token = await authServices.loginuser(req.body)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const signup = async (req, res) => {
    try {
        const token = await authServices.signupuser(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.json({ message: "Signup successful" });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getMe = async (req, res)=>{
    try {
        const result = await authServices.userGetMe(req.user);
        if(result.rows.length === 0){
            res.status(404).json({message: "user not found"})
        }
        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}

export const logout = async (req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.json({ message: "Logged out successfully" });
}
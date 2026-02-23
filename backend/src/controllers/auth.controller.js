import * as authServices from "../services/auth.services.js"

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
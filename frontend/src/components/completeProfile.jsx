import { useState } from "react";

const CompleteProfile = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const name = urlParams.get("name");

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form Data:", { email, name, phone, address, password });
        const response = await fetch("http://localhost:3000/auth/complete-google-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name , phone, address, password }),
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "/";
        } else {
            alert(data.message);
        }
    };

    return (
        <div>
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={email} disabled />
                <input type="text" value={name} disabled />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Complete Signup</button>
            </form>
        </div>
    );
};

export default CompleteProfile;

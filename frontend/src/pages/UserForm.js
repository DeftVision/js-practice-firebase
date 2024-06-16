import { Box, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

const form_default = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}
export default function UserForm() {
    const [form, setForm] = useState(form_default);

    useEffect(() => {

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/api/user/create-user`, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const _response = await response.json();
        if(!response.ok) {
            console.log(_response.error)
        } else {
            console.log(_response.message);
        }
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="standard"
                    required
                    label="First Name"
                    fullWidth
                    id="firstName"
                    type="text"
                    sx={{marginBottom: 3}}
                    autoComplete="on"
                    value={form.firstName}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            firstName: e.target.value,
                        })
                    }}
                />
                <TextField
                    variant="standard"
                    required
                    label="Last Name"
                    fullWidth
                    id="lastName"
                    type="text"
                    sx={{marginBottom: 3}}
                    autoComplete="on"
                    value={form.lastName}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            lastName: e.target.value,
                        })
                    }}
                />
                <TextField
                    variant="standard"
                    required
                    label="Email"
                    fullWidth
                    id="email"
                    type="email"
                    autoComplete="on"
                    value={form.email}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }}
                    sx={{marginBottom: 3}}
                />
                <TextField
                    variant="standard"
                    required
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="on"
                    id="password"
                    value={form.password}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }}
                    sx={{marginBottom: 3}}
                />
                <div>
                    <Button
                        id="submit-button"
                        variant="text"
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Box>
    );
};

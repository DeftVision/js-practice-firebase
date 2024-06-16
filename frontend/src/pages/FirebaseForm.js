import { Box, Button, styled, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import {getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata} from "firebase/storage";

const form_default = {
    name: "",
    formUpload: "",
}

export default function FirebaseForm () {
    const [form, setForm] = useState(form_default);


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:8000/api/firebase/create`, {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json",
            }
        })
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
                   <Box>
                       <TextField
                           required
                           aria-required
                           autoComplete="file-name"
                           type="text"
                           fullWidth
                           id="file-name"
                           label="Name"
                           variant="outlined"
                           sx={{marginBottom: 3}}
                           value={form.name}
                           onChange={(e) => {
                               setForm({
                                   ...form,
                                   name: e.target.value,
                               })
                           }}
                       />
                   </Box>

                    <Box>
                        <Button
                            autoComplete="file"
                            component="label"
                            variant="outlined"
                            id="file"
                            tabIndex={-1}
                            sx={{marginBottom: 3}}
                            startIcon={<CloudUploadIcon />}
                            value={form.formUpload}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    formUpload: e.target.value
                                })
                            }}
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </Box>
                <Box>
                    <Button
                        id="submit-button"
                        sx={{margin: 0}}
                        variant="outlined"
                        type="submit"
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    );
};


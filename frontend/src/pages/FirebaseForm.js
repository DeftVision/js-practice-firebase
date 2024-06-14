import { Box, Button, styled,  TextField, Typography } from '@mui/material';
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
    const [error, setError] = useState(null);

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


    return (
        <Box>
            <Typography padding={3}>firebase form</Typography>

            <form>
                <TextField fullWidth id="name" label="Name" variant="outlined" sx={{paddingBottom: 3}} />
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload file
                    <VisuallyHiddenInput type="file" />
                </Button>
            </form>
        </Box>
    );
};


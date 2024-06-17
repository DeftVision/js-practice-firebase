import { useState, useEffect } from 'react';
import {Box, Button, LinearProgress, styled, TextField, Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {app} from '../components/firebase'
import { v3 as uuid } from 'uuid';
import {useParams} from "react-router-dom";

const form_default = {
    docName: "",
    category: "",
    docUpload: ""
}

export default function DocumentForm({newDocument}) {
    const [form, setForm] = useState(form_default);
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const {id} = useParams();


    // uses the upload button as a label to access file navigator to select file to upload
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

    useEffect(() => {
        async function editDocument() {
            const response = await fetch(`http://localhost:8000/api/docs/document/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const _response = await response.json();
            if(response.ok) {
               const {docName, category, docUpload} = _response.document;
               setForm({docName, category, docUpload})
                console.log(_response.message);
            } else {
                console.error(_response.error);
            }
        }

        if(!newDocument) {
            editDocument();
        }
    }, [])

    const handleFileChange = async (e) => {
        // WHAT DOES THIS DO?
        const file = e.target.files[0];
        if(file) {
            setFileName(file.name);
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setIsUploading(true);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('upload failed', error);
                    setIsUploading(false);
                },
                async () => {
                    try {
                        // WHAT DOES THIS DO?
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setForm((prevForm) => ({
                            ...prevForm,
                            docUpload: downloadURL,
                        }));
                        console.log('File available at: ', downloadURL);
                    } catch (error) {
                        console.error('Failed to get download URL: ', error)
                    } finally {
                        setIsUploading(false);
                    }
                }
            );
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = 'http://localhost:8000/api/docs/new-document';
        let method = 'POST';

        if(!newDocument) {
            url = `http://localhost:8000/api/docs/update/${id}`;
            method = 'PATCH';
        }

        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const _response = await response.json();
        if(!response.ok) {
            console.log(_response.error)
        } else {
            console.log(_response.message);
        }

        // is this needed with the save button disabled?
        /*if(!form.docUpload) {
            console.log('File is not uploaded yet. Please wait.');
            return;
        }*/
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
               <Box>
                   <TextField
                       id="document-name"
                       type="text"
                       variant="outlined"
                       label="doc name"
                       fullWidth
                       autoComplete="document name"
                       sx={{marginBottom: 3}}
                       value={form.docName}
                       onChange={(e) => {
                           setForm({
                               ...form,
                               docName: e.target.value,
                           })
                       }}
                   />
                   <TextField
                       id="document-category"
                       type="text"
                       variant="outlined"
                       label="doc category"
                       fullWidth
                       autoComplete="document category"
                       sx={{marginBottom: 3}}
                       value={form.category}
                       onChange={(e) => {
                           setForm({
                               ...form,
                               category: e.target.value,
                           })
                       }}
                   />
               </Box>
                <Box sx={{display: 'flex', alignItems: 'center', marginBottom: 3}}>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                    >
                        UPLOAD
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {form.docName && (
                        <Typography sx={{marginLeft: 2}}>
                            {fileName}
                        </Typography>
                    )}
                </Box>
                {isUploading && (
                    <Box sx={{width: '100%', marginBottom: 3}}>
                        <LinearProgress variant='determinate' value={uploadProgress} />
                    </Box>
                )}
                <Box>
                    <Button
                        id="submit-button"
                        variant="outlined"
                        type="submit"
                        disabled={!form.docUpload}
                    >
                        SAVE
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
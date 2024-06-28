import { Box, Button, Typography, TextField, LinearProgress, styled } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../components/firebase';

const form_default = {
    title: "",
    category: "",
    downloadUrl: "",
    uniqueFileName: "",
};

export default function DocumentForm({ newDocument }) {
    const [form, setForm] = useState(form_default);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const { id } = useParams();

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
            const response = await fetch(`http://localhost:8004/api/docs/document/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            if (response.ok) {
                const { title, category, downloadUrl, uniqueFileName } = _response.document;
                setForm({ title, category, downloadUrl, uniqueFileName });

            } else {
                console.error('Error occurred while fetching document');
            }
        }
        if (!newDocument) {
            editDocument();
        }
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };

    const deleteExistingFile = async (filePath) => {
        const storage = getStorage();
        const fileRef = ref(storage, filePath);
        try {
            await deleteObject(fileRef);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            console.log('Failed to delete document', error);
        }
    }

    const uploadFileToFirebase = async () => {
        if (file) {
            const uniqueFileName = `${uuidv4()}-${file.name}`
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${uniqueFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setUploading('uploading');

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('upload failed', error);
                    setUploading('error');
                }
            );

            try {
                await uploadTask;
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                setForm((prevForm) => ({
                    ...prevForm,
                    downloadUrl,
                    // Set the value of file stored in firebase to find and update/delete
                    uniqueFileName,
                }));
                setUploading('success');
            } catch (error) {
                console.error('Failed to get download URL: ', error);
                setUploading('error');
            }
        } else {
            throw new Error('No file selected');
        }

    };

    const saveToDb = async () => {
        let url = 'http://localhost:8004/api/docs/new/';
        let method = 'POST';

        if (!newDocument) {
            url = `http://localhost:8004/api/docs/update/${id}`;
            method = 'PATCH';
        }

        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const _response = await response.json();
        if (!response.ok) {
            console.error(_response.error);
        } else {
            console.log(_response.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form.file, newDocument);
        if (form.title && form.category) {
            try {
                if(!newDocument && file) {
                    await deleteExistingFile(`uploads/${form.uniqueFileName}`);
                }
                await uploadFileToFirebase();
                if (form.downloadUrl) {
                    await saveToDb();
                }
            } catch (error) {
                console.error('failed to upload file or save document', error);
            }
        } else {
            console.error('All fields required!!!');
        }
    };

    useEffect(() => {
        if (uploading === 'success') {
            saveToDb();
        }
    }, [uploading]);

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Box>
                    <TextField
                        id="document-name"
                        type="text"
                        variant="outlined"
                        label="title"
                        fullWidth
                        autoComplete="document name"
                        sx={{ marginBottom: 3 }}
                        value={form.title}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                title: e.target.value,
                            });
                        }}
                    />
                    <TextField
                        id="document-category"
                        type="text"
                        variant="outlined"
                        label="category"
                        fullWidth
                        autoComplete="document category"
                        sx={{ marginBottom: 3 }}
                        value={form.category}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                category: e.target.value,
                            });
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
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
                    <Typography sx={{ marginLeft: 2 }}>
                        {fileName}
                    </Typography>
                </Box>
                {uploading === "uploading" && (
                    <Box sx={{ width: '100%', marginBottom: 3 }}>
                        <LinearProgress variant='determinate' value={uploadProgress} />
                    </Box>
                )}
                <Box>
                    <Button
                        id="submit-button"
                        variant="outlined"
                        type="submit"
                    >
                        SAVE
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

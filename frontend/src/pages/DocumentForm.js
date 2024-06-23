import {Box, Button, Typography, TextField, LinearProgress, styled} from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {app} from '../components/firebase'

const form_default = {
    name: "",
    category: "",
    downloadUrl: "",
}

export default function DocumentForm ({newDocument}) {
    const [form, setForm] = useState(form_default);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const {id} = useParams();


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
            const response = await fetch(`http://localhost:8002/api/docs/document/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            if(response.ok) {
                const {name, category, downloadUrl} = _response.document;
                setForm({name, category, downloadUrl});
            } else {
                console.error('Error occurred while fetching document');
            }
        }
        if(!newDocument) {
            editDocument();
        }
    }, [])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if(selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile)
        }
    }

    const uploadFileToFirebase = () => {
        if(file) {
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${file.name}`);
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
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        setForm((prevForm) => ({
                            ...prevForm,
                            downloadUrl,
                        }));
                        setUploading('success');
                    } catch (error) {
                        console.error('Failed to get download URL: ', error)
                    }
                }
            );
        }
    }

    const saveToDb = async () => {
        let url = 'http://localhost:8002/api/docs/new-document/';
        let method = 'POST'

        if(!newDocument) {
            url = `http://localhost:8002/api/docs/update/${id}`;
            method = 'PATCH'
        }

        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const _response = await response.json();
        if(!response.ok) {
            console.error(_response.error);
        } else {
            console.log(_response.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(form.name && form.category) {
            try {
                await uploadFileToFirebase();
                if(form.downloadUrl) {
                    await saveToDb();
                }
            }
            catch (error) {
                console.error('failed to upload file or save document', error);
            }
        } else {
            console.error('All fields required')
        }
    }


    useEffect(() => {
        if(uploading === 'success') {
            saveToDb();
        }
    }, [uploading])

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
                        value={form.name}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value,
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
                        startIcon={<CloudUploadIcon/>}
                    >
                        UPLOAD
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Typography sx={{marginLeft: 2}}>
                        {fileName}
                    </Typography>
                </Box>
                {uploading === "uploading" && (
                    <Box sx={{width: '100%', marginBottom: 3}}>
                        <LinearProgress variant='determinate' value={uploadProgress}/>
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


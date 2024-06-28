import {
    Box,
    Button,
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    Paper,
    IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);

    async function getDocuments() {
        try {
            const response = await fetch(`http://localhost:8004/api/docs/documents`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const _response = await response.json();
            if (response.ok && _response.documents) {
                setDocuments(_response.documents);
            } else {
                console.error(_response.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDocuments();
    }, []);

    async function deleteDocument(documentId, uniqueFileName) {
        try {
            if (uniqueFileName) {
                // Delete the file from Firebase Storage
                const storage = getStorage();
                const fileRef = ref(storage, `uploads/${uniqueFileName}`);
                await deleteObject(fileRef);
            } else {
                console.error('unique file name is not defined');
                return;
            }

            // Delete the document record from the database
            const response = await fetch(`http://localhost:8004/api/docs/delete/${documentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDocuments(documents.filter(document => document._id !== documentId));
            } else {
                const _response = await response.json();
                console.error(_response.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', marginBottom: 4, textAlign: 'center' }}>
                <Button component={Link} to="/document-form">Add New</Button>
            </Box>

            <Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((document) => (
                                <TableRow key={document._id}>
                                    <TableCell>{document.title}</TableCell>
                                    <TableCell>{document.category}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/update/${document._id}`}>
                                            <Edit sx={{ color: 'dodgerblue' }} />
                                        </IconButton>
                                        <IconButton onClick={() => deleteDocument(document._id, document.uniqueFileName)}>
                                            <Delete sx={{ color: 'dimgray' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

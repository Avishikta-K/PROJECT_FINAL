import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DocumentOptions from './DocumentOptions';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';

function DocumentList({ documentList, params }) {
    const router = useRouter();
    const [documents, setDocuments] = useState(documentList);

    useEffect(() => {
        setDocuments(documentList);
    }, [documentList]);

    const handleDeleteDocument = async (docId) => {
        await deleteDoc(doc(db, "workspaceDocuments", docId));
        toast('Document Deleted!');

        // Filter out the deleted document
        const updatedDocuments = documents.filter(d => d.id !== docId);
        setDocuments(updatedDocuments);

        // Automatically select the next document
        const currentIndex = documents.findIndex(d => d.id === docId);
        const nextDocument = updatedDocuments[currentIndex] || updatedDocuments[currentIndex - 1];

        // If there is a next document, navigate to it
        if (nextDocument) {
            router.push(`/workspace/${params.workspaceid}/${nextDocument.id}`);
        }
    };

    return (
        <div>
            {documents.map((doc, index) => (
                <div key={index}
                    onClick={() => router.push(`/workspace/${params.workspaceid}/${doc.id}`)}
                    className={`mt-3 p-2 px-3 hover:bg-gray-200 
                    rounded-lg cursor-pointer flex justify-between items-center
                    ${doc.id === params.documentid && 'bg-gray-200'}
                    `}
                >
                    <div className='flex gap-2 items-center'>
                        {!doc.emoji && <Image src={'/loopdocument.svg'} width={20} height={20} />}
                        <h2 className='flex gap-2'> {doc.emoji} {doc.documentName}</h2>
                    </div>
                    <DocumentOptions doc={doc} deleteDocument={() => handleDeleteDocument(doc.id)} />
                </div>
            ))}
        </div>
    );
}

export default DocumentList;

"use client"
import Logo from '@/app/_components/Logo'
import { Button } from '@/components/ui/button'
import { db } from '@/config/firebaseConfig'
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { Bell, CheckCheck, Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DocumentList from './DocumentList'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import NotifiationBox from './NotifiationBox'

const MAX_FILE = process.env.NEXT_PUBLIC_MAX_FILE_COUNT;

function SideNav({ params }) {
    const [documentList, setDocumentList] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [loadingDocuments, setLoadingDocuments] = useState(true); // State for loading documents
    const router = useRouter();

    useEffect(() => {
        if (params) {
            GetDocumentList();
        }
    }, [params]);

    /**
     * Used to get Document List
     */
    const GetDocumentList = () => {
        const q = query(collection(db, 'workspaceDocuments'),
            where('workspaceId', '==', Number(params?.workspaceid)));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
            setDocumentList(documents);
            setLoadingDocuments(false); // Set loading to false after documents are loaded
        });

        return unsubscribe; // Clean up the listener on unmount
    };

    /**
     * Create New Document
     */
    const CreateNewDocument = async () => {
        if (documentList.length >= MAX_FILE) {
            toast("Limit to a maximum of 5 files", {
                description: "You have reached the max file limit. Please create a new workspace!",
                action: {
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }

        setLoading(true);
        const docId = uuid4();
        await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
            workspaceId: Number(params?.workspaceid),
            createdBy: user?.primaryEmailAddress?.emailAddress,
            coverImage: null,
            emoji: null,
            id: docId,
            documentName: 'Untitled Document',
            documentOutput: []
        });

        await setDoc(doc(db, 'documentOutput', docId.toString()), {
            docId: docId,
            output: []
        });

        setLoading(false);
        router.replace('/workspace/' + params?.workspaceid + "/" + docId);
    };

    return (
        <div className='h-screen md:w-72 hidden md:block fixed bg-white p-5 shadow-2xl'>

        {/* <div className='h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md'> */}
            <div className='flex justify-between items-center'>
                <Logo />
                <NotifiationBox>
                    <Bell className='h-5 w-5 text-gray-500' />
                </NotifiationBox>
            </div>
            <hr className='my-5 border-2 rounded-2xl'></hr>
            <div>
                <div className='flex justify-between items-center'>
                    <h2 className='font-medium'>Workspace Name</h2>
                    <Button size="sm" className="text-lg" onClick={CreateNewDocument}>
                        {loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : '+'}
                    </Button>
                </div>
            </div>

            {/* Loader for Document List */}
            {loadingDocuments ? (
                <div className="flex justify-center items-center h-[200px]">
                    <Loader2Icon className="h-6 w-6 animate-spin text-gray-500" />
                </div>
            ) : (
                <DocumentList documentList={documentList} params={params} />
            )}

            {/* Progress Bar */}
            <div className='absolute bottom-10 w-[85%]'>
                <Progress value={(documentList.length / MAX_FILE) * 100} />
                <h2 className='text-sm font-light my-2 flex justify-start items-center gap-1'><strong>{documentList.length}</strong> Out of <strong>5</strong> files used <CheckCheck className='h-4 w-4'/> </h2>
            </div>
        </div>
    );
}

export default SideNav;

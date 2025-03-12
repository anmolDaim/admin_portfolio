import React, { useState, useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { db, auth } from '../firebaseConfig';
import { navigation } from "../Constants"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [blogCount, setBlogCount] = useState(0);
    const [newBlog, setNewBlog] = useState({ title: '', description: '', timestamp: '', author: '', imageUrl: '' });
    const [adminEmail, setAdminEmail] = useState(null);
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        // Get logged-in admin email
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAdminEmail(user.email);
            } else {
                setAdminEmail(null);
            }
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (adminEmail) {
            fetchBlogs(adminEmail);
        }
    }, [adminEmail]);

    const fetchBlogs = async (email) => {
        try {
            if (!email) return;
            const blogsRef = collection(db, "blogs", email, "blogItems");
            const querySnapshot = await getDocs(blogsRef);
            const blogsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedBlogs = blogsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setBlogs(sortedBlogs);
            setBlogCount(sortedBlogs.length);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const handleChange = (e) => {
        setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        if (!adminEmail) {
            alert("Admin not logged in");
            return;
        }
        if (!newBlog.title || !newBlog.description || !newBlog.timestamp || !newBlog.author || !newBlog.imageUrl) {
            alert("All fields are required");
            return;
        }

        try {
            await addDoc(collection(db, "blogs", adminEmail, "blogItems"), newBlog);
            fetchBlogs(adminEmail); // Refresh the list
            setNewBlog({ title: '', description: '', timestamp: '', author: '', imageUrl: '' });
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await deleteDoc(doc(db, "blogs", adminEmail, "blogItems", id));
            setBlogs(blogs.filter(blog => blog.id !== id));
            setBlogCount(prev => prev - 1);
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const handleEditBlog = (blog) => {
        setEditId(blog.id);
        setNewBlog(blog);
    };

     const handleUpdateBlog = async (e) => {
        e.preventDefault();
        if (!editId) return;

        try {
            await updateDoc(doc(db, "blogs", adminEmail, "blogItems", editId), newBlog);
            fetchBlogs(adminEmail);
            setEditId(null);
            setNewBlog({ title: '', description: '', timestamp: '', author: '', imageUrl: '' });
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    return (
        <div>
            <div className="flex flex-col bg-dark h-screen ">
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                               
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium',
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                </Disclosure>

                <header>
                    <div className="mx-auto  max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard </h1>
                        <h2>Logged in as: {adminEmail || "Not logged in"}</h2>
                    </div>
                </header>
                <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                    <h2 className="text-xl mt-4 ">Total Blogs: {blogCount}</h2>
                    <form onSubmit={editId ? handleUpdateBlog : handleAddBlog} className="mt-6 space-y-4">
                    <input type="text" name="title" value={newBlog.title} onChange={handleChange} placeholder="Title" className="rounded bg-gray-700 p-2 w-full" required />
                    <textarea name="description" value={newBlog.description} onChange={handleChange} placeholder="Description" className="rounded bg-gray-700 p-2 w-full" required />
                    <input type="text" name="timestamp" value={newBlog.timestamp} onChange={handleChange} placeholder="Timestamp (dd/mm/yyyy)" className="rounded bg-gray-700 p-2 w-full" required />
                    <input type="text" name="author" value={newBlog.author} onChange={handleChange} placeholder="Author" className="rounded bg-gray-700 p-2 w-full" required />
                    <input type="text" name="imageUrl" value={newBlog.imageUrl} onChange={handleChange} placeholder="Image URL" className="rounded bg-gray-700 p-2 w-full" required />
                    <button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 px-10 m-8 rounded-md">
                        {editId ? "Update Blog" : "Add Blog"}
                    </button>
                </form>
                    <div className="mt-6 mb-20">
                        <h2 className="text-2xl font-semibold mb-3">Your Blogs</h2>
                        {blogs.length === 0 ? <p>No blogs added yet.</p> : (
                            <ul className="space-y-2">
                                {blogs.map(blog => (
                                    <li key={blog.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold">{blog.title}</h3>
                                        <p className="line-clamp-3">{blog.description}</p>
                                        <p className="text-sm text-gray-400">Author: {blog.author} | {blog.timestamp}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditBlog(blog)} className="text-blue-400 hover:text-blue-600">
                                            <PencilSquareIcon className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-400 hover:text-red-600">
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
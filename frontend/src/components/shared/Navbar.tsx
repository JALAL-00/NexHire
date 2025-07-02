'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Bell, MessageSquare, AlertTriangle, Settings, Search, Menu } from 'lucide-react';
import Image from 'next/image';
import { getMyProfile } from '@/lib/api'; 
import { getInitials } from '@/lib/utils';

interface DecodedToken {
  role: 'candidate' | 'recruiter';
  email?: string;
}

const Navbar = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserRole(decodedToken.role);
        setUserEmail(decodedToken.email || null);

        const fetchNavProfile = async () => {
          try {
            const profileData = await getMyProfile();
            if (profileData) {
              setUserName(`${profileData.firstName || ''} ${profileData.lastName || ''}`.trim());
              
              let picPath = null;
              let coverPath = null;

              if (profileData.role === 'recruiter' && profileData.recruiterProfile) {
                picPath = profileData.recruiterProfile.profilePicture;
                coverPath = profileData.recruiterProfile.coverPhoto;
              } else if (profileData.role === 'candidate' && profileData.candidateProfile) {
                picPath = profileData.candidateProfile.profilePicture;
                coverPath = profileData.candidateProfile.coverPhoto;
              }

              setProfilePic(picPath ? `${API_URL}/uploads/${picPath}` : null);
              setCoverPhoto(coverPath ? `${API_URL}/uploads/${coverPath}` : null);
            }
          } catch (apiError) {
            console.error("Failed to fetch profile for navbar:", apiError);
            setProfilePic(null);
            setCoverPhoto(null);
          }
        };

        fetchNavProfile();

      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = async () => {
    const token = Cookies.get('auth_token');
    try {
      if (token) {
        axios.post(`${API_URL}/auth/logout`, { token });
      }
    } catch (error) {
      console.error("Logout API call failed, but logging out client-side anyway.", error);
    } finally {
      Cookies.remove('auth_token');
      router.push('/home');
    }
  };

  const handleDeleteAccount = async () => {
    const token = Cookies.get('auth_token');
    if (!token) {
      alert("No authentication token found. Please log in again.");
      handleLogout();
      return;
    }
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/auth/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Your account has been successfully deleted.');
      // The modal will disappear automatically on the redirect below
      handleLogout(); 
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("There was an error deleting your account. Please try again.");
      // On error, we DO NOT close the modal, so the user can try again or cancel.
    } finally {
      // --- THIS IS THE FIX ---
      // We only reset the loading state. We do not close the modal here.
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    const modal = document.getElementById('delete_account_modal') as HTMLDialogElement;
    modal?.showModal();
  };

  const goToProfile = () => {
    if (userRole === 'recruiter') {
      router.push('/recruiter-profile');
    } else {
      router.push('/candidate-profile');
    }
  };

  const handleManageProfile = () => {
    if (userRole === 'recruiter') {
      router.push('/recruiter-settings');
    } else if (userRole === 'candidate') {
      router.push('/candidate-settings');
    }
  };

  const handleEditAvailability = () => {
    if (userRole === 'candidate') {
      router.push('/candidate-settings?section=availability');
    }
  };

  return (
    <>
      <header className="bg-base-100 border-b shadow-sm sticky top-0 z-50">
        <div className="navbar container mx-auto px-4 py-4">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <Menu size={24} />
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                {userRole === 'candidate' && (
                  <>
                    <li><Link href="/jobs">Find Jobs</Link></li>
                    <li><Link href="/scraping">Scraping</Link></li>
                    <li><Link href="/career-guides">Career Guides</Link></li> 
                  </>
                )}
                {userRole === 'recruiter' && (
                  <>
                    <li><Link href="/create-job">Post a Job</Link></li>
                    <li><Link href="/Screening">Ai Screening</Link></li>
                  </>
                )}
                <div className="divider my-1"></div>
                <li><Link href="/assistant">Nexi Ai</Link></li>
                <li><Link href="/scroll-dashboard">Orbit Scroll</Link></li>
              </ul>
            </div>
            
            <Link href="/home" className="btn btn-ghost text-xl font-bold text-primary">NexHire</Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            {userRole === 'candidate' && (
              <>
                {/* 
                <div className="form-control">
                  <input type="text" placeholder="Search for jobs" className="input input-bordered w-24 md:w-64 h-10" />
                </div>
                */}
                <Link href="/jobs" className="btn btn-ghost">Find Jobs</Link>
                <Link href="/scraping" className="btn btn-ghost">Scraping</Link>
                <Link href="/career-guides" className="btn btn-ghost">Career Guides</Link>
              </>
            )}

            {userRole === 'recruiter' && (
              <>
              {/* 
                <div className="form-control">
                  <input type="text" placeholder="Search for candidates" className="input input-bordered w-24 md:w-64 h-10" />
                </div>
                */}
                <Link href="/create-job" className="btn btn-ghost">Post a Job</Link>
                <Link href="/Screening" className="btn btn-ghost">Ai Screening</Link>
              </>
            )}

            <Link href="/assistant" className="btn btn-ghost">Nexi Ai</Link>
            <Link href="/scroll-dashboard" className="btn btn-ghost">Orbit Scroll</Link>
          </div>

          <div className="navbar-end gap-4">
            <Link href="/messages" className="btn btn-ghost btn-circle"><MessageSquare size={20} /></Link>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator"><Bell size={20} /><span className="badge badge-xs badge-primary indicator-item" /></div>
            </button>

            <div className="dropdown dropdown-hover dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={goToProfile}>
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-primary/20 text-primary overflow-hidden">
                  {profilePic ? (
                    <Image
                      src={profilePic}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      key={profilePic}
                    />
                  ) : (
                    <span className="font-bold">{getInitials(userName)}</span>
                  )}
                </div>
              </label>
              
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-96 bg-white shadow-xl rounded-box">
                <div className="relative">
                  <div className="h-20 w-full rounded-t-xl bg-base-200">
                    {coverPhoto && (
                      <Image src={coverPhoto} alt="Cover" layout="fill" objectFit="cover" className="rounded-t-xl" />
                    )}
                  </div>
                  <div className="absolute left-4 -bottom-8 w-16 h-16 rounded-full overflow-hidden ring-4 ring-white flex items-center justify-center bg-base-300 text-base-content">
                    {profilePic ? (
                      <Image src={profilePic} alt="Avatar" width={64} height={64} key={`dropdown-${profilePic}`} className="object-cover w-full h-full" />
                    ) : (
                      <span className="font-bold text-2xl">{getInitials(userName)}</span>
                    )}
                  </div>
                </div>
                <div className="pt-12 px-4 pb-2 text-center">
                  <h2 className="text-lg font-bold uppercase">{userName || '...'}</h2>
                  {userEmail && <p className="text-sm text-gray-600">{userEmail}</p>}
                  <button className="btn btn-primary btn-sm w-full mt-4" onClick={goToProfile}>View Profile</button>
                  <button className="btn btn-primary btn-sm w-full mt-4" onClick={() => router.push('/pricing')}>Upgrade to PRO</button>
                </div>
                <div className="px-4 py-2 border-t text-sm">
                  <p className="text-gray-500 mb-2">Viewing as: {userRole === 'candidate' ? 'Creative' : 'Recruiter'}</p>
                  <ul className="space-y-1 text-left">
                    <li
                      className={userRole === 'candidate' ? 'hover:text-primary cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                      onClick={handleEditAvailability}
                    >
                      Edit My Availability
                    </li>
                    <li className="hover:text-primary cursor-pointer" onClick={handleManageProfile}>Manage Profile</li>
                    {userRole === 'candidate' && (<li className="hover:text-primary cursor-pointer"><Link href="/saved-jobs">Saved Jobs</Link></li>)}
                    <li className="hover:text-primary cursor-pointer">Settings</li>
                    <li className="hover:text-primary cursor-pointer">Help</li>
                    <li className="hover:text-error cursor-pointer" onClick={handleLogout}>Logout</li>
                    <li className="hover:text-error cursor-pointer" onClick={openDeleteModal}>Delete Account</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <dialog id="delete_account_modal" className="modal">
        <div className="modal-box">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-error" />
            <h3 className="font-bold text-lg mt-4">Delete Account</h3>
            <p className="py-4">Are you sure you want to delete your account? This action is permanent and cannot be undone.</p>
          </div>
          <div className="modal-action justify-center gap-4">
            <form method="dialog">
              <button className="btn w-32">Cancel</button>
            </form>
            <button className="btn btn-error w-32" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? <span className="loading loading-spinner"></span> : 'Delete'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Navbar;
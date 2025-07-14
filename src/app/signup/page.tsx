'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';
import { supabaseBrowserClient } from '../../../utils/supabase/client';
import { useAuth } from '../../context/AuthContext';


type FormData = {
  email: string;
  password: string;
};

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = React.useState(false);
  const { setUser } = useAuth()


  async function signUpWithEmail(email: string, password: string) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sign up');
    return data;
  }

const handleGitHub = async () => {
    await supabaseBrowserClient.auth.signInWithOAuth({
        provider: 'github',
      });
      router.push('/auth/callback')
  };

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true)
    try {
      const { error } = await signUpWithEmail(email, password)
      if (error) {
        throw error
      }
      const res = await fetch('/api/auth/user')
      const { user } = await res.json()
      setUser(user)
      toast.success('Signed up successfully!')
      router.push('/chat')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }






  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black font-[family-name:var(--font-geist-mono)] text-black">
            Create a new account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black-500 font-[family-name:var(--font-geist-mono)]"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-geist-mono)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black-500 font-[family-name:var(--font-geist-mono)]"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-geist-mono)]">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-[#383838] font-bold text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-20 sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#ffffff" />
                  <span>Signing Up...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center mt-6 text-gray-500 text-sm">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-center font-[family-name:var(--font-geist-mono)]">
            Or sign up with
          </span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex justify-center mt-3">
          <button onClick={handleGitHub} className="cursor-pointer bg-black hover:bg-[#383838] text-white px-4 py-2 rounded flex items-center gap-2 font-[family-name:var(--font-geist-mono)]">
            <Image className='invert' src="/github.png" alt="GitHub" width={20} height={20} />
            GitHub
          </button>
        </div>


        <div className="mt-2 text-center text-sm text-gray-600 font-[family-name:var(--font-geist-mono)]">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}

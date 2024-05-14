'use client';

import React from 'react';
import { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import useModalStore from '@/store/modalStore';

import useUserStore from '@/store/userStore';

import UserNicknameModifyModal from '@/components/modal/UserNicknameModify';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  src: string;
  width: number;
  quality?: number;
}

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();

  const {
    headerDropDown,
    setHeaderDropDown,
    nicknameModalState,
    setNicknameModalState,
    testNum,
    increaseTestNum,
    idealDropDown,
    setIdealDropDownFalse,
  } = useModalStore();

  const { isLogin, setIsLogin, deleteAccessToken } = useUserStore();

  const imageLoader = ({ src, width, quality }: Props) => {
    const params = [`imwidth = ${width}`];
    return `https://myain.co.kr/${src}?imwidth=${width}`;
  };

  const oauthLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // alert('성공');
        const result = await res.json();
        console.log('치킨', result);
        console.log('바보', result.message);
        Swal.fire({
          title: '로그아웃 되었습니다.',
          icon: 'success',
          confirmButtonColor: '#ff7169',
          heightAuto: false,
        });
        if (result.code === 200) {
          console.log('로그아웃 성공');
          router.push('/');
        } else if (result.code === 401) {
          console.log('바보', result);
          return;
        } else if (result.code === 403) {
          alert('ERROR_FORBIDDEN');
          return;
        } else if (result.code === 404) {
          alert('ERROR_NOT_FOUND');
          return;
        } else {
          console.log(result.code);
          // return;
        }
      } else {
        alert('실패');
        console.log('로그아웃 실패');
        console.log(res);
        console.log(res.status);
      }
    } catch (error) {
      alert('실패2');
      console.log('에러로 로그아웃 실패');
      console.log(error);
    }

    deleteAccessToken();
  };

  return (
    pathName !== '/chat/chatroom' && (
      <div className='z-50'>
        <div className='z-50 w-full text-sm'>
          <div className='flex justify-between'>
            <div>
              <Link href='/'>
                <Image
                  loader={imageLoader}
                  src='/logo/ainlogo.svg'
                  alt='Ain Logo'
                  className='ml-3'
                  width={120}
                  height={30}
                  priority
                />
              </Link>
            </div>
            <div className='flex items-center relative'>
              {isLogin ? (
                <div className='flex flex-col'>
                  <div className='flex' onClick={setHeaderDropDown}>
                    <div>
                      <Image
                        src='/icon/islogin.svg'
                        alt='로그인한 상태'
                        className='mr-2 cursor-pointer'
                        width={28}
                        height={28}
                        priority
                      />
                    </div>

                    {headerDropDown ? (
                      <div className='flex items-center'>
                        <Image
                          src='/icon/dropdown_triangle.svg'
                          alt='드롭다운 활성화'
                          className='mr-6 cursor-pointer'
                          width={10}
                          height={10}
                          priority
                        />
                      </div>
                    ) : (
                      <div className='flex items-center'>
                        <Image
                          src='/icon/dropdown_triangle_revert.svg'
                          alt='드롭다운 활성화'
                          className='mr-6 cursor-pointer'
                          width={10}
                          height={10}
                          priority
                        />
                      </div>
                    )}
                  </div>
                  {headerDropDown ? (
                    <div className='absolute top-10 right-4 z-100'>
                      <div>
                        <button
                          type='button'
                          onClick={setNicknameModalState}
                          className='mt-4 bg-white border-2 text-xs w-32 px-2 py-3 font-semibold font-sans'
                          style={{ fontSize: '16px' }}
                        >
                          닉네임 수정
                        </button>
                      </div>
                      <div>
                        <button
                          type='button'
                          onClick={oauthLogout}
                          className='border-2 border-t-1 bg-white  text-xs w-32 px-2 py-3 font-semibold font-sans'
                          style={{ fontSize: '16px' }}
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                <Link href='/login'>
                  <Image
                    src='/icon/login.svg'
                    alt='로그인'
                    className='mr-6 cursor-pointer'
                    width={28}
                    height={28}
                    priority
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div>
          {nicknameModalState && (
            <div className='static'>
              <div
                className='overlay justify-center fixed top-0 w-full h-full bg-black opacity-70 z-30 max-w-md'
                onClick={setNicknameModalState}
              />
              <div className='h-screen'>
                <div className='z-40 absolute h-full w-full '>
                  <UserNicknameModifyModal closeModal={setNicknameModalState} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}

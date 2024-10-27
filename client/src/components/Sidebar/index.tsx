'use client';

import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { Icon, LucideIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { usePathname } from 'next/navigation';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)

  const sidebarClassNames = `fixed flex flex-col justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? 'w-0 hidden' : 'w-64'}
  `

  return (
    <div className={sidebarClassNames}>
      <div className='flex h-full w-full flex-col justify-start'>
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          <div className='text-xl font-bold text-gray-800 dark:text-white'>
            MEROPROJECT
          </div>
          {!isSidebarCollapsed ? (
            <button className='py-3' onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
              <X className='h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white' />
            </button>
          ) : null}
        </div>
        <div className='flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700'>
          <Image
            alt="Logo"
            src='/logo.png'
            width={40}
            height={40}
          />
          <div className=''>
            <h3 className='text-md font-bold tracking-wide dark:text-gray-200'>
              MERO TEAM
            </h3>
            <div className='mt-1 flex items-start gap-2'>
              <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>
        {/*Nav Links*/}
        <nav className='z-10 w-full'>
          <SidebarLink
            label='Home'
            icon={Home}
            href='/'
          />
         <SidebarLink
            label='Timeline'
            icon={Briefcase}
            href='/timeline'
          />
         <SidebarLink
            label='Search'
            icon={Search}
            href='/search'
          />
         <SidebarLink
            label='Settings'
            icon={Settings}
            href='/settings'
          />
          <SidebarLink
            label='Users'
            icon={User}
            href='/users'
          />
          <SidebarLink
            label='Teams'
            icon={Users}
            href='/teams'
          />
        </nav>

        {/* Projects */}
        <button 
          onClick={() => setShowProjects((prev) => !prev)} 
          className='flex w-full items-center justify-between px-8 py-3 text-gray-500'>
            <span className=''>Projects</span>
            {showProjects ? (
              <ChevronUp className='h-5 w-5' />
            ) : <ChevronDown className='w-5 h-5' />}
        </button>
        {/* Projects Lists */}
        {showProjects && projects?.map((project) => (
          <SidebarLink 
            key={project.id}
            icon={Briefcase}
            label={project.name}
            href={`/projects/${project.id}`}
          />
        ))}
        {/* Priorities */}
        <button 
          onClick={() => setShowPriority((prev) => !prev)} 
          className='flex w-full items-center justify-between px-8 py-3 text-gray-500'>
            <span className=''>Priority</span>
            {showPriority ? (
              <ChevronUp className='h-5 w-5' />
            ) : <ChevronDown className='w-5 h-5' />}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              label='Urgent'
              icon={AlertCircle}
              href='/priority/urgent'
            />
            <SidebarLink
              label='High'
              icon={ShieldAlert}
              href='/priority/high'
            />
            <SidebarLink
              label='Medium'
              icon={AlertTriangle}
              href='/priority/medium'
            />
            <SidebarLink
              label='Low'
              icon={AlertOctagon}
              href='/priority/low'
            />
            <SidebarLink
              label='Backlog'
              icon={Layers3}
              href='/priority/backlog'
            />
          </>
        )}
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === '/' && href === '/dashboard');

  return (
    <Link
      href={href}
      className='w-full'
    >
      <div className={
        `relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-100 text-white dark:bg-gray-600' : ''
        } justify-start px-8 py-3`
      }>
        {
          isActive && (
            <div className='absolute left-0 top-0 h-full w-[5px] bg-blue-200'/>
          )
        }
        <Icon className='h-6 w-6 text-gray-800 dark:text-gray-100' />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    
    </Link>
  )
}
export default Sidebar
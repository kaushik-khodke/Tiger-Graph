'use client'

import dynamic from 'next/dynamic'

const SentinelApp = dynamic(() => import('@/components/sentinel-app'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background, #F7F9FC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#172033',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid #253B80',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>Initializing Sentinel AI...</span>
      </div>
    </div>
  ),
})

export default function Page() {
  return <SentinelApp />
}

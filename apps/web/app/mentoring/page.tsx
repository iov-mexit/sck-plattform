'use client';

import { Shield, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MentoringPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/agents')}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Agents</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center bg-green-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Mentoring Agent</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4">
            Mentoring Agent
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Role-specific guidance, best practices, and skill development. 
            Get personalized mentoring for your specific role and career goals.
          </p>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-black mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              The Mentoring Agent is currently under development. It will provide:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-black mb-2">Role-Based Learning</h3>
                <p className="text-sm text-gray-600">Personalized learning paths for your specific role</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-black mb-2">Best Practices</h3>
                <p className="text-sm text-gray-600">Industry best practices and implementation guidance</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-black mb-2">Skill Development</h3>
                <p className="text-sm text-gray-600">Track and improve your professional skills</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-black mb-2">Peer Learning</h3>
                <p className="text-sm text-gray-600">Collaborate and learn from peers in similar roles</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

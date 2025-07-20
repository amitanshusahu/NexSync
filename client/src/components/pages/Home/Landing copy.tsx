// Landing.tsx
import React from 'react';
import { ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">TaskSync</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Manage Projects Seamlessly with Telegram
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          TaskSync integrates with your Telegram groups to streamline project management. WhatsApp and Slack integrations coming soon!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition flex items-center">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose TaskSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-12 w-12 text-indigo-600" />}
              title="Telegram Integration"
              description="Manage tasks directly in your Telegram groups with real-time updates."
            />
            <FeatureCard
              icon={<CheckCircle className="h-12 w-12 text-indigo-600" />}
              title="Task Automation"
              description="Automate repetitive tasks and set reminders for deadlines."
            />
            <FeatureCard
              icon={<ArrowRight className="h-12 w-12 text-indigo-600" />}
              title="Coming Soon"
              description="WhatsApp and Slack integrations are on the way to expand your workflow."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Streamline Your Projects?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams using TaskSync to manage projects effortlessly through Telegram.
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TaskSync</h3>
              <p className="text-gray-400">Streamlining project management through messaging platforms.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: support@tasksync.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-8">&copy; 2025 TaskSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Landing;
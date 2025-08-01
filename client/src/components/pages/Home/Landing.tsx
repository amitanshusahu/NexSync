import { ArrowRight, Bot, Check, ChevronDown, Command, LayoutDashboard, MessageSquare, Plus, Rocket, Settings, Slack, Smartphone, Users, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const thisYear = new Date().getFullYear();

  const features = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Unified Dashboard",
      description: "Manage all your projects from a single, intuitive dashboard with customizable views."
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Telegram Integration",
      description: "Connect directly with your Telegram groups. Get updates and manage tasks without leaving the app."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Assign tasks, track progress, and communicate with your team in real-time."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Automated Workflows",
      description: "Set up rules to automate repetitive tasks and focus on what matters."
    }
  ];

  const integrations = [
    { name: "Telegram", available: true },
    { name: "WhatsApp", available: false },
    { name: "Slack", available: false },
    { name: "Discord", available: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary-light" />
          <span className="text-xl font-semibold text-gray-900">TaskFlow</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#integrations" className="text-gray-600 hover:text-gray-900 transition-colors">Integrations</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
          <button className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center space-x-1">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4">
          <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
          <a href="#integrations" className="block text-gray-600 hover:text-gray-900">Integrations</a>
          <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
          <button className="w-full text-left text-gray-600 hover:text-gray-900">Sign In</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-primary text-sm font-medium mb-6">
            <Rocket className="h-4 w-4 mr-2" />
            <span>Now with Telegram integration</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Project Management <br className="hidden md:block" />
            <span className="text-primary-light">Made Simple</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Connect your team's communication tools and manage projects seamlessly in one place. Starting with Telegram today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-primary-light text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <span>See Demo</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY TEAMS AT</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {['Company A', 'Company B', 'Company C', 'Company D'].map((company, index) => (
            <div key={index} className="flex justify-center">
              <div className="h-12 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                {company}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Work Smarter, Not Harder</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your project management workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all cursor-pointer ${activeFeature === index ? 'bg-white border border-gray-200 shadow-sm' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${activeFeature === index ? 'bg-indigo-100 text-primary-light' : 'bg-gray-100 text-gray-600'}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md h-96 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Mockup of dashboard */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm font-medium text-gray-900">Project Dashboard</div>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>

                {activeFeature === 0 && (
                  <div className="space-y-4">
                    <div className="h-4 bg-indigo-100 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="h-3 bg-gray-100 rounded-full mb-2 w-1/2"></div>
                          <div className="h-2 bg-gray-100 rounded-full mb-1 w-full"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeFeature === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-primary-light" />
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="h-2 bg-gray-100 rounded-full w-24 mb-1"></div>
                        <div className="h-2 bg-gray-100 rounded-full w-32"></div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 justify-end">
                      <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
                        <div className="h-2 bg-indigo-200 rounded-full w-20 mb-1"></div>
                        <div className="h-2 bg-indigo-200 rounded-full w-16"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-8">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
                      <div className="text-xs text-gray-500">Telegram connected</div>
                    </div>
                  </div>
                )}

                {activeFeature === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-light" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Team Members</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Alex', 'Sam', 'Taylor', 'Jordan'].map((name) => (
                        <div key={name} className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            {name.charAt(0)}
                          </div>
                          <div className="text-sm text-gray-700">{name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4 text-primary-light" />
                        <div className="text-sm font-medium text-primary">Invite team member</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeature === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary-light" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Automation Rules</div>
                    </div>
                    <div className="space-y-3">
                      {['When task is completed', 'When deadline approaches', 'When mentioned in chat'].map((rule) => (
                        <div key={rule} className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-light" />
                          </div>
                          <div className="text-sm text-gray-700">{rule}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-2 bg-gray-100 rounded-lg text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Command className="h-3 w-3" />
                        <span>+</span>
                        <span>K</span>
                        <span>to add new rule</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Works Where You Do</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with the tools your team already uses every day.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all ${integration.available ? 'border-indigo-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-70'}`}
              >
                <div className="flex flex-col items-center text-center">
                  {integration.name === 'Telegram' && <MessageSquare className="h-8 w-8 text-primary-light mb-3" />}
                  {integration.name === 'WhatsApp' && <Smartphone className="h-8 w-8 text-gray-500 mb-3" />}
                  {integration.name === 'Slack' && <Slack className="h-8 w-8 text-gray-500 mb-3" />}
                  {integration.name === 'Discord' && <Settings className="h-8 w-8 text-gray-500 mb-3" />}

                  <h3 className="text-lg font-medium text-gray-900 mb-1">{integration.name}</h3>
                  <div className={`text-xs px-2 py-1 rounded-full ${integration.available ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-600'}`}>
                    {integration.available ? 'Available now' : 'Coming soon'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-primary-light rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to transform your workflow?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of teams who are already managing their projects more efficiently with TaskFlow.
          </p>
          <button className="bg-white text-primary-light px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto">
            <span>Start Free Trial</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Integrations', 'Pricing', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                {['Documentation', 'Guides', 'Blog', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                {['About', 'Careers', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-3">
                {['Twitter', 'LinkedIn', 'GitHub', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bot className="h-6 w-6 text-primary-light" />
              <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
            </div>
            <p className="text-sm text-gray-500">© {thisYear} TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
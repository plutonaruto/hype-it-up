import React, { useState } from 'react';
import { ArrowLeft, Upload, DollarSign, ExternalLink } from 'lucide-react';

interface CreatorFormProps {
  onSubmit: (formData: any) => void;
  onBack: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    cause: 'disaster-relief',
    externalLink: '',
    videoFile: null as File | null
  });

  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const causes = [
    { id: 'disaster-relief', label: 'Disaster Relief', emoji: '🏠' },
    { id: 'medical', label: 'Medical Emergency', emoji: '🏥' },
    { id: 'education', label: 'Education', emoji: '📚' },
    { id: 'food-security', label: 'Food Security', emoji: '🍽️' },
    { id: 'community', label: 'Community Support', emoji: '🤝' },
    { id: 'environment', label: 'Environmental', emoji: '🌱' }
  ];

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-40 flex items-center justify-between px-4 py-4">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-semibold">Submit Fundraiser</h1>
        <div className="w-6"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-24 left-4 right-4 z-40">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-white text-xs mt-2">
          <span className={step >= 1 ? 'text-white' : 'text-gray-500'}>Video</span>
          <span className={step >= 2 ? 'text-white' : 'text-gray-500'}>Details</span>
          <span className={step >= 3 ? 'text-white' : 'text-gray-500'}>Review</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="absolute top-36 left-0 right-0 bottom-0 px-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold">Upload Your Video</h2>
              
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white mb-2">Tap to upload video</p>
                <p className="text-gray-400 text-sm">MP4, MOV up to 10MB</p>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden"
                  onChange={(e) => setFormData({...formData, videoFile: e.target.files?.[0] || null})}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Video Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Give your fundraiser a compelling title"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell your story and explain why this cause matters..."
                  rows={4}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <button 
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.description}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold">Fundraiser Details</h2>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Fundraising Goal</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    placeholder="10000"
                    className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Cause Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {causes.map((cause) => (
                    <button
                      key={cause.id}
                      type="button"
                      onClick={() => setFormData({...formData, cause: cause.id})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.cause === cause.id
                          ? 'border-pink-500 bg-pink-500/20'
                          : 'border-gray-700 bg-gray-800'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{cause.emoji}</span>
                      <span className="text-white text-xs">{cause.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">External Donation Link (Optional)</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({...formData, externalLink: e.target.value})}
                    placeholder="https://gofundme.com/your-campaign"
                    className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.goal}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-white text-xl font-bold">Review & Submit</h2>
              
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Title:</span>
                  <p className="text-white">{formData.title}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Goal:</span>
                  <p className="text-white">${parseInt(formData.goal).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Cause:</span>
                  <p className="text-white">{causes.find(c => c.id === formData.cause)?.label}</p>
                </div>
                {formData.externalLink && (
                  <div>
                    <span className="text-gray-400 text-sm">External Link:</span>
                    <p className="text-blue-400 text-sm break-all">{formData.externalLink}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">AI Verification Process</h3>
                <p className="text-yellow-100 text-sm">
                  Your submission will be reviewed by our AI system to verify legitimacy and ensure compliance with community guidelines. This typically takes 2-3 minutes.
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold"
                >
                  Submit for Verification
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatorForm;
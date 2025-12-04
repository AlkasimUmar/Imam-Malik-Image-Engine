import React, { useState } from 'react';
import { analyzeImage, replaceBackground, editImageWithPrompt, enhanceImage, createPassportPhoto } from '../services/geminiService';
import { Spinner } from './Spinner';
import { BackgroundColor, AspectRatio, ASPECT_RATIOS } from '../types';

interface ImageEditorProps {
  initialImage: string; // base64
  onBack: () => void;
  onSaveToHistory: (img: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onBack, onSaveToHistory }) => {
  const [currentImage, setCurrentImage] = useState<string>(initialImage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'color' | 'edit' | 'tools'>('color');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("1:1");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getBase64Data = () => {
    return currentImage.split(',')[1];
  };

  const getMimeType = () => {
    return currentImage.substring(currentImage.indexOf(':') + 1, currentImage.indexOf(';'));
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const result = await analyzeImage(getBase64Data(), getMimeType());
      setAnalysis(result);
    } catch (e) {
      setErrorMsg("Failed to analyze image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleColorChange = async (color: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const newImageB64 = await replaceBackground(getBase64Data(), getMimeType(), color, false);
      setCurrentImage(`data:image/jpeg;base64,${newImageB64}`);
    } catch (e) {
      setErrorMsg("Failed to update background.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomEdit = async () => {
    if (!customPrompt) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const newImageB64 = await editImageWithPrompt(getBase64Data(), getMimeType(), customPrompt, selectedAspectRatio);
      setCurrentImage(`data:image/jpeg;base64,${newImageB64}`);
    } catch (e) {
      setErrorMsg("Failed to edit image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const newImageB64 = await enhanceImage(getBase64Data(), getMimeType());
      setCurrentImage(`data:image/jpeg;base64,${newImageB64}`);
    } catch (e) {
      setErrorMsg("Failed to enhance image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePassport = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const newImageB64 = await createPassportPhoto(getBase64Data(), getMimeType());
      setCurrentImage(`data:image/jpeg;base64,${newImageB64}`);
    } catch (e) {
      setErrorMsg("Failed to create passport photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `imam-malik-edit-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onSaveToHistory(currentImage);
  };

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm z-10">
        <button onClick={onBack} className="text-gray-600 font-medium flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="font-bold text-lg text-gray-800">Editor</h2>
        <button onClick={handleDownload} className="text-primary font-bold flex items-center">
          Save
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Main Preview */}
        <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
           <img src={currentImage} alt="Preview" className="max-w-full max-h-full object-contain" />
           {isProcessing && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-20">
               <div className="text-center">
                  <Spinner size="lg" color="border-white" />
                  <p className="text-white mt-2 font-medium animate-pulse">Processing with Gemini...</p>
               </div>
             </div>
           )}
        </div>

        {/* Tools Section */}
        <div className="p-4 space-y-6">
          
          {/* Analysis Button */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-semibold text-gray-700">AI Analysis</h3>
               <button 
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium hover:bg-indigo-200"
               >
                 Analyze Image
               </button>
             </div>
             {analysis && (
               <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                 {analysis}
               </p>
             )}
          </div>

          {/* Edit Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('color')}
                className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'color' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500'}`}
              >
                BG Color
              </button>
              <button 
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'tools' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500'}`}
              >
                Pro Tools
              </button>
              <button 
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'edit' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500'}`}
              >
                Magic Edit
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'color' && (
                <div className="grid grid-cols-4 gap-4">
                   <button onClick={() => handleColorChange(BackgroundColor.WHITE)} className="flex flex-col items-center space-y-2 group">
                     <div className="w-12 h-12 rounded-full border shadow-sm bg-white group-hover:scale-105 transition-transform"></div>
                     <span className="text-xs text-gray-600">White</span>
                   </button>
                   <button onClick={() => handleColorChange(BackgroundColor.BLUE)} className="flex flex-col items-center space-y-2 group">
                     <div className="w-12 h-12 rounded-full border shadow-sm bg-blue-600 group-hover:scale-105 transition-transform"></div>
                     <span className="text-xs text-gray-600">Blue</span>
                   </button>
                   <button onClick={() => handleColorChange(BackgroundColor.RED)} className="flex flex-col items-center space-y-2 group">
                     <div className="w-12 h-12 rounded-full border shadow-sm bg-red-600 group-hover:scale-105 transition-transform"></div>
                     <span className="text-xs text-gray-600">Red</span>
                   </button>
                   <button onClick={() => handleColorChange(BackgroundColor.BLACK)} className="flex flex-col items-center space-y-2 group">
                     <div className="w-12 h-12 rounded-full border shadow-sm bg-black group-hover:scale-105 transition-transform"></div>
                     <span className="text-xs text-gray-600">Black</span>
                   </button>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleEnhance}
                    disabled={isProcessing}
                    className="p-4 border rounded-xl hover:bg-gray-50 flex flex-col items-center text-center space-y-2"
                  >
                     <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     <div>
                       <span className="block font-semibold text-gray-800 text-sm">Enhance Clarity</span>
                       <span className="block text-xs text-gray-500">Sharpen & Upscale</span>
                     </div>
                  </button>
                  <button 
                    onClick={handlePassport}
                    disabled={isProcessing}
                    className="p-4 border rounded-xl hover:bg-gray-50 flex flex-col items-center text-center space-y-2"
                  >
                     <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <div>
                       <span className="block font-semibold text-gray-800 text-sm">Passport Std</span>
                       <span className="block text-xs text-gray-500">Auto Crop & White BG</span>
                     </div>
                  </button>
                </div>
              )}

              {activeTab === 'edit' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Prompt</label>
                    <textarea 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., 'Add a vintage filter', 'Remove the person in background'..."
                      className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none resize-none h-20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Aspect Ratio</label>
                    <div className="flex flex-wrap gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setSelectedAspectRatio(ratio)}
                          className={`text-xs px-3 py-1.5 rounded-lg border ${selectedAspectRatio === ratio ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleCustomEdit}
                    disabled={!customPrompt || isProcessing}
                    className={`w-full py-3 rounded-lg font-semibold shadow-md transition-colors ${!customPrompt ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
                  >
                    Generate Edit
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
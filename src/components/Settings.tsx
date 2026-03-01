import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Video, Building2, Percent, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface SettingsProps {
  onSettingsUpdate: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSettingsUpdate }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (response.ok) {
      alert('Settings saved successfully!');
      onSettingsUpdate();
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">System Settings</h2>
          <p className="text-zinc-500 mt-2 text-lg">Configure company details, taxes, and appearance.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-white text-black rounded-sm font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Profile */}
        <div className="glass-panel p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Company Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Company Name</label>
              <input 
                className="glass-input w-full"
                value={settings.company_name || ''}
                onChange={e => setSettings({...settings, company_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Address</label>
              <textarea 
                className="glass-input w-full min-h-[80px] py-3 resize-none"
                value={settings.company_address || ''}
                onChange={e => setSettings({...settings, company_address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                <input 
                  className="glass-input w-full"
                  value={settings.company_email || ''}
                  onChange={e => setSettings({...settings, company_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mobile</label>
                <input 
                  className="glass-input w-full"
                  value={settings.company_mobile || ''}
                  onChange={e => setSettings({...settings, company_mobile: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax & Compliance */}
        <div className="glass-panel p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Tax & Compliance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">GST Rate (SGST/CGST each)</label>
              <div className="relative">
                <input 
                  type="number"
                  className="glass-input w-full pr-10"
                  value={settings.gst_rate || ''}
                  onChange={e => setSettings({...settings, gst_rate: e.target.value})}
                />
                <span className="absolute right-4 top-2.5 text-zinc-500 font-bold">%</span>
              </div>
              <p className="text-[9px] text-zinc-600 uppercase font-bold">Total GST will be double this value (SGST + CGST)</p>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">GSTIN Number</label>
              <input 
                className="glass-input w-full font-mono"
                value={settings.company_gstin || ''}
                onChange={e => setSettings({...settings, company_gstin: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">VAT TIN NO</label>
              <input 
                className="glass-input w-full"
                value={settings.company_vat_tin || ''}
                onChange={e => setSettings({...settings, company_vat_tin: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">CST NO</label>
              <input 
                className="glass-input w-full"
                value={settings.company_cst_no || ''}
                onChange={e => setSettings({...settings, company_cst_no: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Visuals & Background */}
        <div className="glass-panel p-8 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Visuals & Background</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Background Media URL</label>
                <input 
                  className="glass-input w-full"
                  placeholder="https://example.com/image.jpg or video.mp4"
                  value={settings.bg_media_url || ''}
                  onChange={e => setSettings({...settings, bg_media_url: e.target.value})}
                />
                <p className="text-[9px] text-zinc-600 uppercase font-bold italic">Leave empty for default abstract background</p>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Media Type</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSettings({...settings, bg_media_type: 'image'})}
                    className={`flex-1 py-3 rounded-sm border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${settings.bg_media_type === 'image' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Image
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, bg_media_type: 'video'})}
                    className={`flex-1 py-3 rounded-sm border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${settings.bg_media_type === 'video' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                  >
                    <Video className="w-3.5 h-3.5" /> Video
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-sm border border-white/5 p-4 flex flex-col items-center justify-center text-center">
              {settings.bg_media_url ? (
                <div className="w-full aspect-video rounded-sm overflow-hidden bg-zinc-900 border border-white/10">
                  {settings.bg_media_type === 'video' ? (
                    <video src={settings.bg_media_url} className="w-full h-full object-cover" muted loop autoPlay />
                  ) : (
                    <img src={settings.bg_media_url} className="w-full h-full object-cover" alt="Background Preview" />
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No Custom Media Set</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';
import { useState } from 'react';
import { Save, Globe, Mail, Shield, Database, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const handleSave = () => toast.success('Nastavenia uložené!');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nastavenia platformy</h1>
          <p className="text-gray-400">Globálne nastavenia EshopBuilder</p>
        </div>
        <button onClick={handleSave} className="btn-primary"><Save className="w-5 h-5" />Uložiť</button>
      </div>

      <div className="grid gap-6">
        <div className="stat-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" />Všeobecné</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Názov platformy</label>
              <input type="text" defaultValue="EshopBuilder" className="input-field" />
            </div>
            <div>
              <label className="form-label">Podpora email</label>
              <input type="email" defaultValue="support@eshopbuilder.sk" className="input-field" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" />Email nastavenia</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">SMTP Server</label>
              <input type="text" defaultValue="smtp.example.com" className="input-field" />
            </div>
            <div>
              <label className="form-label">SMTP Port</label>
              <input type="text" defaultValue="587" className="input-field" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-blue-400" />Databáza</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <div className="text-2xl font-bold">PostgreSQL</div>
              <div className="text-gray-400 text-sm">Typ databázy</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <div className="text-2xl font-bold">2.4 GB</div>
              <div className="text-gray-400 text-sm">Veľkosť</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">Online</div>
              <div className="text-gray-400 text-sm">Stav</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

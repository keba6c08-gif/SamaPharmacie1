'use client';

import { useState } from 'react';

type UploadType = 'logo' | 'document';

type UploadFormProps = {
  pharmacyId: string;
  uploadType: UploadType;
};

export default function UploadForm({ pharmacyId, uploadType }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'license' | 'tax_document' | 'certificate'>('license');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleUpload() {
    if (!file) {
      setMessage('Choisissez un fichier avant de téléverser.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pharmacyId', pharmacyId);

    if (uploadType === 'document') {
      formData.append('type', type);
    }

    const endpoint = uploadType === 'logo'
      ? '/api/pharmacies/upload-logo'
      : '/api/pharmacies/upload-document';

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ?? 'Erreur lors du téléversement');
      setLoading(false);
      return;
    }

    setMessage(uploadType === 'logo' ? 'Logo mis à jour avec succès.' : 'Document téléversé avec succès.');
    setFile(null);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {uploadType === 'document' && (
        <select
          value={type}
          onChange={(event) => setType(event.target.value as 'license' | 'tax_document' | 'certificate')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="license">Autorisation / licence</option>
          <option value="tax_document">Document fiscal</option>
          <option value="certificate">Certificat</option>
        </select>
      )}

      <input
        type="file"
        accept={uploadType === 'logo' ? 'image/*' : '*'}
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
      />

      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={loading}
        className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {loading ? 'Téléversement…' : uploadType === 'logo' ? 'Uploader le logo' : 'Uploader le document'}
      </button>

      {message && <p className="text-sm text-slate-700">{message}</p>}
    </div>
  );
}

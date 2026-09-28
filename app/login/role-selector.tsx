export function RoleSelector() {
  return (
    <fieldset>
      <input type="hidden" name="role" value="pharmacien" />
      <legend className="mb-2 block text-sm font-medium text-gray-700">Compte pharmacien</legend>
      <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Informations de la pharmacie</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">À renseigner lors de la création du compte.</p>
          </div>
          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-medium text-slate-700">Nom du responsable</label>
            <input id="full-name" name="full_name" type="text" required autoComplete="name" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Prénom et nom" />
          </div>
          <div>
            <label htmlFor="pharmacy-name" className="mb-1 block text-sm font-medium text-slate-700">Nom de la pharmacie</label>
            <input id="pharmacy-name" name="pharmacy_name" type="text" required autoComplete="organization" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Ex. Pharmacie du Plateau" />
          </div>
          <div>
            <label htmlFor="pharmacy-phone" className="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
            <input id="pharmacy-phone" name="phone" type="tel" required autoComplete="tel" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Ex. +221 77 000 00 00" />
          </div>
          <div>
            <label htmlFor="pharmacy-address" className="mb-1 block text-sm font-medium text-slate-700">Adresse</label>
            <input id="pharmacy-address" name="pharmacy_address" type="text" required autoComplete="street-address" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Rue et quartier" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pharmacy-city" className="mb-1 block text-sm font-medium text-slate-700">Ville</label>
              <input id="pharmacy-city" name="pharmacy_city" type="text" required autoComplete="address-level2" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Dakar" />
            </div>
            <div>
              <label htmlFor="pharmacy-region" className="mb-1 block text-sm font-medium text-slate-700">Région</label>
              <input id="pharmacy-region" name="pharmacy_region" type="text" required autoComplete="address-level1" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Dakar" />
            </div>
            <div>
              <label htmlFor="pharmacist-registration" className="mb-1 block text-sm font-medium text-slate-700">Numéro d’inscription à l’Ordre des pharmaciens</label>
              <input id="pharmacist-registration" name="pharmacist_registration" type="text" required autoComplete="off" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Référence professionnelle" />
            </div>
            <div>
              <label htmlFor="pharmacy-authorization" className="mb-1 block text-sm font-medium text-slate-700">Numéro d’autorisation de la pharmacie</label>
              <input id="pharmacy-authorization" name="pharmacy_authorization" type="text" required autoComplete="off" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Référence d’autorisation" />
            </div>
            <label className="flex items-start gap-2 text-xs leading-5 text-slate-700">
              <input name="compliance_attestation" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-700" />
              <span>Je certifie que ces informations sont exactes et que je suis autorisé à gérer cette pharmacie.</span>
            </label>
            <p className="text-xs leading-5 text-slate-500">
              Ces références ne sont pas vérifiées automatiquement. L’accès professionnel restera en attente d’un contrôle des justificatifs.
            </p>
          </div>
      </div>
    </fieldset>
  );
}
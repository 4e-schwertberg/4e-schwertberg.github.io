(function(){
  var form = document.getElementById('f4e-form');
  var msg = document.getElementById('f4e-msg');

  /* --- Individual / company --- */
  var typPerson = document.getElementById('typ-person');
  var typFirma = document.getElementById('typ-firma');
  var blockPerson = document.getElementById('block-person');
  var blockFirma = document.getElementById('block-firma');
  var vorname = document.getElementById('f-vorname');
  var nachname = document.getElementById('f-nachname');
  var firma = document.getElementById('f-firma');

  function applyTyp(){
    var isFirma = typFirma.checked;
    blockPerson.hidden = isFirma;
    blockFirma.hidden = !isFirma;
    vorname.required = !isFirma;
    nachname.required = !isFirma;
    firma.required = isFirma;
  }
  typPerson.addEventListener('change', applyTyp);
  typFirma.addEventListener('change', applyTyp);

  /* --- Membership type --- */
  var rolleRadios = form.querySelectorAll('input[name="Rolle"]');
  var blockStrombedarf = document.getElementById('block-strombedarf');
  var blockAnlagengroesse = document.getElementById('block-anlagengroesse');

  function applyRolle(){
    var rolle = form.querySelector('input[name="Rolle"]:checked').value;
    var isBeidemitglied = rolle === 'Bezieher und Einspeiser';
    blockStrombedarf.hidden = false;
    blockAnlagengroesse.hidden = !isBeidemitglied;
    document.getElementById('f-anlagengroesse').required = isBeidemitglied;
    document.getElementById('block-zaehlpunkt-einspeiser').hidden = !isBeidemitglied;
    document.getElementById('f-zaehlpunkt-einspeiser').required = isBeidemitglied;
    document.getElementById('block-teilnahmefaktor-einspeiser').hidden = !isBeidemitglied;
    document.getElementById('f-teilnahmefaktor-einspeiser').required = isBeidemitglied;
  }
  rolleRadios.forEach(function(r){ r.addEventListener('change', applyRolle); });

  /* --- VAT status: visual highlight --- */
  var ustRadios = form.querySelectorAll('input[name="USt_Behandlung"]');

  function applyUst(){
    ustRadios.forEach(function(r){
      r.closest('.f4e-radio-item').classList.toggle('checked', r.checked);
    });
  }
  ustRadios.forEach(function(r){ r.addEventListener('change', applyUst); });
  applyUst();

  /* --- Copy account holder name from personal details --- */
  document.getElementById('btn-uebernehmen').addEventListener('click', function(){
    var name = typFirma.checked ? firma.value : (vorname.value + ' ' + nachname.value).trim();
    var holder = document.getElementById('f-kontoinhaber');
    holder.value = name;
    holder.dispatchEvent(new Event('input', { bubbles: true }));
  });

  applyTyp();
  applyRolle();

  /* ============================================================ */
  /* PDF generation (pdf-lib) â€” fills the form template locally   */
  /* in the browser; no server involved.                          */
  /* ============================================================ */

  // PDF template: page 0 = Bezieher, page 1 = Einspeiser, both with AcroForm fields.
  var PDF_TEMPLATE = '/assets/docs/Aufnahmeantrag-template.pdf';

  async function generatePdf(){
    var data = Object.fromEntries(new FormData(form));
    var isBeidemitglied = data.Rolle === 'Bezieher und Einspeiser';
    var isFirma = data.Antragstellertyp === 'Firma';

    var bytes = await fetch(PDF_TEMPLATE).then(function(r){
      if (!r.ok) throw new Error('Vorlage nicht erreichbar: ' + PDF_TEMPLATE);
      return r.arrayBuffer();
    });

    var pdfDoc = await PDFLib.PDFDocument.load(bytes);
    var pdfForm = pdfDoc.getForm();

    var vorname = isFirma ? (data.Firmenname || '') : (data.Vorname || '');
    var nachname = isFirma ? '' : (data.Nachname || '');
    var fullAddress = (data.Strasse_Hausnummer || '') + ', ' + (data.PLZ || '') + ' ' + (data.Ort || '');

    function setText(name, value){
      if (value == null || value === '') return;
      try { pdfForm.getTextField(name).setText(String(value)); } catch(e){}
    }
    function checkField(name){
      try { pdfForm.getCheckBox(name).check(); } catch(e){}
    }

    // Bezieher page (page 0) â€” always filled
    setText('txtBezieherVorname',           vorname);
    setText('txtBezieherNachname',          nachname);
    setText('txtBezieherAdresse',           fullAddress);
    setText('txtBezieherEmailAdresse',      data.email);
    setText('txtBezieherTelefonnummer',     data.Telefon);
    setText('txtBezieherUidNummer',         data.UID_Nummer);
    setText('txtBezieherZaehlpunktnummer',  data.Zaehlpunkt_Bezieher_Rest);
    setText('nbrBezieherTeilnahmefaktor',   data.Teilnahmefaktor_Bezieher);
    setText('nbrBezieherStrombedarf',       data.Strombedarf_kWh);
    setText('txtBezieherKontoName',         data.Kontoinhaber);
    setText('txtBezieherKontoIban',         data.IBAN);
    if (data.Vereinsstatuten_Erhalt) checkField('chkBezieherStatuten');

    // Einspeiser page (page 1) â€” only for combined membership
    if (isBeidemitglied){
      setText('txtEinspeiserVorname',           vorname);
      setText('txtEinspeiserNachname',          nachname);
      setText('txtEinspeiserAdresse',           fullAddress);
      setText('txtEinspeiserEmailAdresse',      data.email);
      setText('txtEinspeiserTelefonnummer',     data.Telefon);
      setText('txtEinspeiserUidNummer',         data.UID_Nummer);
      setText('txtEinspeiserZaehlpunktnummer',  data.Zaehlpunkt_Einspeiser_Rest);
      setText('nbrEinspeiserTeilnahmefaktor',   data.Teilnahmefaktor_Einspeiser);
      setText('nbrEinspeiserAnlagengroesse',    data.Anlagengroesse_kWp);
      setText('txtEinspeiserKontoName',         data.Kontoinhaber);
      setText('txtEinspeiserKontoIban',         data.IBAN);
      if (data.Vereinsstatuten_Erhalt) checkField('chkEinspeiserStatuten');
    }

    // VAT status: one checkbox field per page
    var ust = data.USt_Behandlung || '';
    var UST_BEZIEHER = {
      'Privater bzw. Kleinunternehmer (< â‚¬ 55.000,-- Umsatz p.a.)': 'chkBezieherSteuerKleinunternehmer',
      'Unternehmer (20% USt)':                                       'chkBezieherSteuerUnternehmer',
      'pauschalierter Landwirt (13% USt)':                           'chkBezieherSteuerLandwirt',
      'Gemeinde - Betrieb gewerblicher Art':                         'chkBezieherSteuerGemeindeGewerbe',
      'Gemeinde - Kein Betrieb gewerblicher Art':                    'chkBezieherSteuerGemeindeKeinGewerbe'
    };
    var UST_EINSPEISER = {
      'Privater bzw. Kleinunternehmer (< â‚¬ 55.000,-- Umsatz p.a.)': 'chkEinspeiserSteuerKleinunternehmer',
      'Unternehmer (20% USt)':                                       'chkEinspeiserSteuerUnternehmer',
      'pauschalierter Landwirt (13% USt)':                           'chkEinspeiserSteuerLandwirt',
      'Gemeinde - Betrieb gewerblicher Art':                         'chkEinspeiserSteuerGemeindeGewerbe',
      'Gemeinde - Kein Betrieb gewerblicher Art':                    'chkEinspeiserSteuerGemeindeKeinGewerbe'
    };
    if (UST_BEZIEHER[ust]) checkField(UST_BEZIEHER[ust]);
    if (isBeidemitglied && UST_EINSPEISER[ust]) checkField(UST_EINSPEISER[ust]);

    // Flatten fields; remove Einspeiser page for Bezieher-only membership
    pdfForm.flatten();
    if (!isBeidemitglied) pdfDoc.removePage(1);

    var outBytes = await pdfDoc.save();
    var blob = new Blob([outBytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Aufnahmeantrag-4E-Schwertberg.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Path to the SEPA direct debit mandate PDF template.
  var PDF_SEPA_TEMPLATE = '/assets/docs/SEPA-Lastschriftmandat-template.pdf';

  async function generateSepa(){
    var data = Object.fromEntries(new FormData(form));
    var isFirma = data.Antragstellertyp === 'Firma';
    var name = isFirma ? (data.Firmenname || '') : ((data.Vorname || '') + ' ' + (data.Nachname || '')).trim();
    var fullAddress = (data.Strasse_Hausnummer || '') + ', ' + (data.PLZ || '') + ' ' + (data.Ort || '');
    var datum = new Date().toLocaleDateString('de-AT');

    var bytes = await fetch(PDF_SEPA_TEMPLATE).then(function(r){
      if (!r.ok) throw new Error('SEPA-Vorlage nicht erreichbar: ' + PDF_SEPA_TEMPLATE);
      return r.arrayBuffer();
    });

    var pdfDoc = await PDFLib.PDFDocument.load(bytes);
    var pdfForm = pdfDoc.getForm();

    function setText(name, value){
      if (value == null || value === '') return;
      try { pdfForm.getTextField(name).setText(String(value)); } catch(e){}
    }

    setText('txtSepaZahlerName',      name);
    setText('txtSepaZahlerAdresse',   fullAddress);
    setText('txtSepaIban',            data.IBAN);
    setText('txtSepaBic',             data.BIC);
    setText('txtSepaKreditinstitut',  data.Kreditinstitut);
    setText('txtSepaDatum',           datum);

    pdfForm.flatten();

    var outBytes = await pdfDoc.save();
    var blob = new Blob([outBytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'SEPA-Lastschriftmandat-4E-Schwertberg.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById('btn-pdf').addEventListener('click', function(){
    if (!form.reportValidity()) return;
    var btn = this;
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'PDF wird erstellt â€¦';
    msg.className = 'f4e-msg';
    Promise.allSettled([generatePdf(), generateSepa()])
      .then(function(results){
        var failed = results.filter(function(r){ return r.status === 'rejected'; });
        if (failed.length){
          console.error(failed);
          msg.textContent = 'PDF konnte nicht erstellt werden: ' + failed.map(function(r){ return r.reason.message; }).join(' | ');
          msg.className = 'f4e-msg show err';
        }
      })
      .finally(function(){
        btn.disabled = false;
        btn.textContent = originalText;
      });
  });
})();

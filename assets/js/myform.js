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

  /* --- Zählpunkt validation --- */
  // The PDF template prints this prefix next to the field, so only the last 20 digits are written into it.
  var ZP_PREFIX = 'AT00310000000';
  var zpBezieher = document.getElementById('f-zaehlpunkt-bezieher');
  var zpEinspeiser = document.getElementById('f-zaehlpunkt-einspeiser');

  function zpStrip(raw){ return raw.replace(/[\s.\-]/g, '').toUpperCase(); }

  function zpRest(raw){
    var v = zpStrip(raw);
    if (v.length === 33 && v.indexOf(ZP_PREFIX) === 0) v = v.slice(13);
    return /^\d{20}$/.test(v) ? v : null;
  }

  function zpMessage(input){
    var v = zpStrip(input.value);
    if (!v) return '';
    if (v.indexOf('AT') === 0 && v.indexOf(ZP_PREFIX) !== 0 && ZP_PREFIX.indexOf(v) !== 0){
      return 'Diese Zählpunktnummer gehört nicht zum Netz der Linz Netz GmbH (sie muss mit AT 003100 00000 beginnen). Eine Teilnahme ist nur im Netz der Linz Netz GmbH möglich.';
    }
    var rest = zpRest(input.value);
    if (rest === null){
      return 'Bitte geben Sie die Zählpunktnummer vollständig ein: alle 33 Zeichen (beginnt mit AT 003100 00000) oder nur die letzten 20 Ziffern.';
    }
    if (input === zpEinspeiser && rest.slice(0, 2) !== '99'){
      return 'Die Zählpunktnummer für die Einspeisung beginnt nach AT 003100 00000 mit 99. Bitte prüfen Sie Ihre Angabe.';
    }
    return '';
  }

  function updateZaehlpunktValidity(){
    var einspeiserVisible = !document.getElementById('block-zaehlpunkt-einspeiser').hidden;
    var msgEinspeiser = einspeiserVisible ? zpMessage(zpEinspeiser) : '';
    if (einspeiserVisible && !msgEinspeiser){
      var a = zpRest(zpBezieher.value), b = zpRest(zpEinspeiser.value);
      if (a !== null && a === b){
        msgEinspeiser = 'Strombezug und Einspeisung haben zwei verschiedene Zählpunktnummern. Bitte prüfen Sie Ihre Angaben.';
      }
    }
    zpBezieher.setCustomValidity(zpMessage(zpBezieher));
    zpEinspeiser.setCustomValidity(msgEinspeiser);
  }
  zpBezieher.addEventListener('input', updateZaehlpunktValidity);
  zpEinspeiser.addEventListener('input', updateZaehlpunktValidity);

  /* --- IBAN validation (ISO 13616 mod-97 checksum) --- */
  var ibanInput = document.getElementById('f-iban');

  function compactUpper(raw){ return raw.replace(/[\s\-]/g, '').toUpperCase(); }

  function isValidIban(raw){
    var v = compactUpper(raw);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v)) return false;
    if (v.slice(0, 2) === 'AT' && v.length !== 20) return false;
    var r = v.slice(4) + v.slice(0, 4), rem = 0;
    for (var i = 0; i < r.length; i++){
      var d = String(parseInt(r[i], 36));               // A=10 … Z=35, digits unchanged
      for (var j = 0; j < d.length; j++) rem = (rem * 10 + Number(d[j])) % 97;
    }
    return rem === 1;
  }

  function formatIban(raw){ return compactUpper(raw).replace(/(.{4})/g, '$1 ').trim(); }

  function updateIbanValidity(){
    var empty = compactUpper(ibanInput.value) === '';
    ibanInput.setCustomValidity(empty || isValidIban(ibanInput.value) ? '' :
      'Diese IBAN ist ungültig. Bitte prüfen Sie jede Stelle. Eine österreichische IBAN hat 20 Zeichen und beginnt mit AT.');
  }
  ibanInput.addEventListener('input', updateIbanValidity);

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
    updateZaehlpunktValidity();
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
  /* PDF generation (pdf-lib) — fills the form template locally   */
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

    // Bezieher page (page 0) — always filled
    setText('txtBezieherVorname',           vorname);
    setText('txtBezieherNachname',          nachname);
    setText('txtBezieherAdresse',           fullAddress);
    setText('txtBezieherEmailAdresse',      data.email);
    setText('txtBezieherTelefonnummer',     data.Telefon);
    setText('txtBezieherUidNummer',         data.UID_Nummer);
    setText('txtBezieherZaehlpunktnummer',  zpRest(data.Zaehlpunkt_Bezieher_Rest));
    setText('nbrBezieherTeilnahmefaktor',   data.Teilnahmefaktor_Bezieher);
    setText('nbrBezieherStrombedarf',       data.Strombedarf_kWh);
    setText('txtBezieherKontoName',         data.Kontoinhaber);
    setText('txtBezieherKontoIban',         formatIban(data.IBAN));
    if (data.Vereinsstatuten_Erhalt) checkField('chkBezieherStatuten');

    // Einspeiser page (page 1) — only for combined membership
    if (isBeidemitglied){
      setText('txtEinspeiserVorname',           vorname);
      setText('txtEinspeiserNachname',          nachname);
      setText('txtEinspeiserAdresse',           fullAddress);
      setText('txtEinspeiserEmailAdresse',      data.email);
      setText('txtEinspeiserTelefonnummer',     data.Telefon);
      setText('txtEinspeiserUidNummer',         data.UID_Nummer);
      setText('txtEinspeiserZaehlpunktnummer',  zpRest(data.Zaehlpunkt_Einspeiser_Rest));
      setText('nbrEinspeiserTeilnahmefaktor',   data.Teilnahmefaktor_Einspeiser);
      setText('nbrEinspeiserAnlagengroesse',    data.Anlagengroesse_kWp);
      setText('txtEinspeiserKontoName',         data.Kontoinhaber);
      setText('txtEinspeiserKontoIban',         formatIban(data.IBAN));
      if (data.Vereinsstatuten_Erhalt) checkField('chkEinspeiserStatuten');
    }

    // VAT status: one checkbox field per page
    var ust = data.USt_Behandlung || '';
    var UST_BEZIEHER = {
      'Privater bzw. Kleinunternehmer (< € 55.000,-- Umsatz p.a.)': 'chkBezieherSteuerKleinunternehmer',
      'Unternehmer (20% USt)':                                       'chkBezieherSteuerUnternehmer',
      'pauschalierter Landwirt (13% USt)':                           'chkBezieherSteuerLandwirt',
      'Gemeinde - Betrieb gewerblicher Art':                         'chkBezieherSteuerGemeindeGewerbe',
      'Gemeinde - Kein Betrieb gewerblicher Art':                    'chkBezieherSteuerGemeindeKeinGewerbe'
    };
    var UST_EINSPEISER = {
      'Privater bzw. Kleinunternehmer (< € 55.000,-- Umsatz p.a.)': 'chkEinspeiserSteuerKleinunternehmer',
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

    return pdfDoc.save();
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
    setText('txtSepaIban',            formatIban(data.IBAN));
    setText('txtSepaBic',             compactUpper(data.BIC || ''));
    setText('txtSepaKreditinstitut',  data.Kreditinstitut);
    setText('txtSepaDatum',           datum);

    pdfForm.flatten();

    return pdfDoc.save();
  }

  /* --- Result: download links, share button, next steps --- */
  var btnPdf = document.getElementById('btn-pdf');
  var nextBox = document.getElementById('f4e-next');
  var dlAntrag = document.getElementById('dl-antrag');
  var dlSepa = document.getElementById('dl-sepa');
  var btnShare = document.getElementById('btn-share');
  var shareHint = document.getElementById('share-hint');
  var objectUrls = [];
  var shareFiles = [];

  function showError(text){
    msg.textContent = 'Die PDFs konnten nicht erstellt werden. Bitte versuchen Sie es noch einmal oder verwenden Sie das Papierformular. (Technische Details: ' + text + ')';
    msg.className = 'f4e-msg show err';
  }

  function showResult(antragBytes, sepaBytes){
    // Old URLs are only revoked when new PDFs replace them; revoking right after a click breaks downloads in Safari/Firefox.
    objectUrls.forEach(function(u){ URL.revokeObjectURL(u); });
    var antrag = new File([antragBytes], '4e-Aufnahmeantrag.pdf', { type: 'application/pdf' });
    var sepa = new File([sepaBytes], '4e-SEPA-Lastschriftmandat.pdf', { type: 'application/pdf' });
    shareFiles = [antrag, sepa];
    dlAntrag.href = URL.createObjectURL(antrag);
    dlSepa.href = URL.createObjectURL(sepa);
    objectUrls = [dlAntrag.href, dlSepa.href];
    btnShare.hidden = !(navigator.canShare && navigator.canShare({ files: shareFiles }));
    shareHint.hidden = btnShare.hidden;
    nextBox.hidden = false;
    nextBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nextBox.focus({ preventScroll: true });
  }

  btnShare.addEventListener('click', function(){
    navigator.share({ files: shareFiles, title: 'Aufnahmeantrag 4E Schwertberg' }).catch(function(e){
      if (e && e.name === 'AbortError') return;
      msg.textContent = 'Das Teilen hat nicht funktioniert. Bitte speichern Sie die beiden PDFs über die Schaltflächen oben und hängen Sie sie selbst an Ihre E-Mail an. (Technische Details: ' + (e && e.message ? e.message : String(e)) + ')';
      msg.className = 'f4e-msg show err';
    });
  });

  // Edited answers would leave the PDFs shown here out of date.
  function hideResult(){ nextBox.hidden = true; }
  form.addEventListener('input', hideResult);
  form.addEventListener('change', hideResult);

  btnPdf.addEventListener('click', function(){
    updateZaehlpunktValidity();
    updateIbanValidity();
    if (!form.reportValidity()) return;
    btnPdf.disabled = true;
    btnPdf.textContent = 'PDFs werden erstellt …';
    msg.className = 'f4e-msg';
    Promise.all([generatePdf(), generateSepa()])
      .then(function(pdfs){ showResult(pdfs[0], pdfs[1]); })
      .catch(function(e){
        console.error(e);
        showError(e && e.message ? e.message : String(e));
      })
      .finally(function(){
        btnPdf.disabled = false;
        btnPdf.textContent = 'Antrag erstellen (2 PDFs)';
      });
  });
})();
